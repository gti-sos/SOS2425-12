<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as echarts from 'echarts';
  
    let chart;
    let chartDiv;
  
    let data1 = [];
    let data2 = [];
  
    async function loadData() {
      // Fetch de la API annual-evolutions
      const res1 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
      const allData = await res1.json();
      data1 = allData.filter(d => d.year === 2023 && d.technology === "Hidráulica");
  
      // Fetch de la API del INE para consumo de agua
      const res2 = await fetch('https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/26075');
      const json2 = await res2.json();
  
      // Procesar los datos del INE
      const consumoAgua = {};
      json2.Data.forEach(entry => {
        const ccaa = entry.Nombre;
        const valor = parseFloat(entry.Valor);
        consumoAgua[ccaa] = valor;
      });
  
      data2 = consumoAgua;
  
      drawChart();
    }
  
    function drawChart() {
      const comunidades = data1.map(d => d.aacc);
      const energiaVendida = data1.map(d => d.energy_sold);
      const consumo = comunidades.map(c => data2[c] || 0);
  
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params) {
            const energia = params.find(p => p.seriesName === 'Energía Hidráulica').value;
            const agua = params.find(p => p.seriesName === 'Consumo de Agua').value;
            return `<b>${params[0].axisValue}</b><br/>
                    Energía Hidráulica: ${energia} GWh<br/>
                    Consumo de Agua: ${agua} L/hab/día`;
          }
        },
        legend: {
          data: ['Energía Hidráulica', 'Consumo de Agua']
        },
        xAxis: {
          type: 'category',
          data: comunidades
        },
        yAxis: [
          {
            type: 'value',
            name: 'Energía Hidráulica (GWh)'
          },
          {
            type: 'value',
            name: 'Consumo de Agua (L/hab/día)'
          }
        ],
        series: [
          {
            name: 'Energía Hidráulica',
            type: 'bar',
            data: energiaVendida
          },
          {
            name: 'Consumo de Agua',
            type: 'line',
            yAxisIndex: 1,
            data: consumo
          }
        ]
      };
  
      const myChart = echarts.init(chartDiv);
      myChart.setOption(option);
      chart = myChart;
    }
  
    onMount(() => {
      loadData();
      window.addEventListener('resize', () => chart?.resize());
    });
  </script>
  
  <h2>Integración: Energía Hidráulica vs Consumo de Agua</h2>
  <div bind:this={chartDiv} style="width: 100%; height: 500px;"></div>
  