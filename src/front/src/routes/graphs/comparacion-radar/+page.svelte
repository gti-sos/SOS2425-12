<script>
  //@ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import * as echarts from 'echarts';

  let chartDom;
  let myChart;
  let chartData = [];
  let years = [];
  let selectedYear;

  onMount(async () => {
    chartDom = document.getElementById('echarts-radar');
    myChart = echarts.init(chartDom);
    const res = await fetch("/api/v2/annual-retributions");
    const rawData = await res.json();
    console.log("Datos de la API:", rawData);
    processDataForRadar(rawData);
  });

  onDestroy(() => {
    if (myChart) {
      myChart.dispose();
    }
  });

  function processDataForRadar(rawData) {
    const yearlyData = {};
    rawData.forEach(item => {
      if (!yearlyData[item.year]) {
        yearlyData[item.year] = {
          investment_compensation: 0,
          operation_compensation: 0,
          specific_compensation: 0,
          subsidized_energy: 0,
        };
        years.push(item.year);
      }
      yearlyData[item.year].investment_compensation += item.investment_compensation;
      yearlyData[item.year].operation_compensation += item.operation_compensation;
      yearlyData[item.year].specific_compensation += item.specific_compensation;
      yearlyData[item.year].subsidized_energy += item.subsidized_energy;
    });

    years = [...new Set(years)].sort();
    console.log("Años encontrados:", years);

    chartData = years.map(year => ({
      name: year, // Dejamos 'name' como número (coincidiendo con el backend)
      value: [
        yearlyData[year]?.investment_compensation || 0,
        yearlyData[year]?.operation_compensation || 0,
        yearlyData[year]?.specific_compensation || 0,
        yearlyData[year]?.subsidized_energy || 0,
      ],
    }));
    console.log("Datos para el radar:", chartData);

    selectedYear = years[0];
    updateChart(selectedYear);
  }

  function updateChart(year) {
    const selectedData = chartData.find(item => item.name === Number(year)); // Convertimos 'year' a Number
    console.log("Datos para el año seleccionado:", selectedData, year);

    if (!selectedData) {
      console.error(`No se encontraron datos para el año: ${year}`);
      return;
    }

    const option = {
      title: {
        text: `Compensación por Tipo en ${year}`,
        left: 'center'
      },
      radar: {
        indicator: [
          { name: 'Inversión', max: Math.max(...chartData.map(item => item.value[0])) * 1.1 },
          { name: 'Operación', max: Math.max(...chartData.map(item => item.value[1])) * 1.1 },
          { name: 'Específica', max: Math.max(...chartData.map(item => item.value[2])) * 1.1 },
          { name: 'Subvencionada', max: Math.max(...chartData.map(item => item.value[3])) * 1.1 },
        ],
      },
      series: [
        {
          name: 'Compensación',
          type: 'radar',
          data: [selectedData],
        },
      ],
    };

    myChart.setOption(option);
  }

  $: if (myChart && selectedYear) {
    updateChart(selectedYear);
  }
</script>

<h2>Radar de comparación de tipos</h2>

<select bind:value={selectedYear}>
  {#each years as year}
    <option value={year}>{year}</option>
  {/each}
</select>

<div id="echarts-radar" style="width: 100%; height: 400px;"></div>

<style>
  /* Opcional: Ajustes de estilo adicionales */
</style>