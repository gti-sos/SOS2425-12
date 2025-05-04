<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import * as echarts from 'echarts';

  let chart;
  let chartDiv;

  let data1 = [];
  let data2 = [];

  async function loadData() {
    try {
      const res1 = await fetch('https://sos2425-21.onrender.com/api/v1/home-buying-selling-stats');
      data1 = await res1.json();

      const res2 = await fetch('http://localhost:16078/api/v1/annual-evolutions');
      data2 = await res2.json();

      const years1 = [...new Set(data1.map(d => d.year))];
      const years2 = [...new Set(data2.map(d => d.year))];
      const commonYears = years1.filter(y => years2.includes(y));

      const grouped = {};

      commonYears.forEach(year => {
        if (!grouped[year]) grouped[year] = {
          protected: 0,
          new: 0,
          secondhand: 0,
          energy: 0
        };
      });

      data1.forEach(d => {
        if (grouped[d.year]) {
          grouped[d.year].protected += Number(d.transaction_protected_housing) || 0;
          grouped[d.year].new += Number(d.transaction_new_housing) || 0;
          grouped[d.year].secondhand += Number(d.transaction_secondhand_housing) || 0;
        }
      });

      data2.forEach(d => {
        if (grouped[d.year]) {
          grouped[d.year].energy += Number(d.energy_sold) || 0;
        }
      });

      const years = Object.keys(grouped).sort();

      const protectedHousing = years.map(y => grouped[y].protected);
      const newHousing = years.map(y => grouped[y].new);
      const secondhandHousing = years.map(y => grouped[y].secondhand);
      const energySold = years.map(y => grouped[y].energy);

      drawChart(years, protectedHousing, newHousing, secondhandHousing, energySold);

    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  function drawChart(years, protectedHousing, newHousing, secondhandHousing, energySold) {
    const option = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Protegida', 'Nueva', 'Segunda Mano', 'Energía Vendida'] },
      xAxis: { type: 'category', data: years },
      yAxis: { type: 'value', name: 'Cantidad' },
      series: [
        { name: 'Protegida', type: 'bar', stack: 'vivienda', data: protectedHousing },
        { name: 'Nueva', type: 'bar', stack: 'vivienda', data: newHousing },
        { name: 'Segunda Mano', type: 'bar', stack: 'vivienda', data: secondhandHousing },
        { name: 'Energía Vendida', type: 'bar', data: energySold }
      ]
    };

    chart = echarts.init(chartDiv);
    chart.setOption(option);
  }

  onMount(() => {
    loadData();
    window.addEventListener('resize', () => chart?.resize());
  });
</script>

<h2>Integración G21-home-buying-selling-stats</h2>
<div bind:this={chartDiv} style="width: 100%; height: 500px;"></div>

<style>
  h2 {
    margin-top: 1rem;
    font-size: 1.8rem;
  }
</style>
