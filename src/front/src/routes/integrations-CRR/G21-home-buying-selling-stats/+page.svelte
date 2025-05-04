<script>
      // @ts-nocheck
    import { onMount } from 'svelte';
    import * as echarts from 'echarts';
  
    let chart;
    let chartDiv;
  
    let data1 = [];
    let data2 = [];
  
    // Simulación: fetch de dos APIs distintas
    async function loadData() {
      // API de viviendas
      const res1 = await fetch('https://sos2425-21.onrender.com/api/v1/home-buying-selling-stats');
      data1 = await res1.json();
  
      // API de energía
      const res2 = await fetch('http://localhost:16078/api/v1/annual-evolutions');
      data2 = await res2.json();
  
      drawChart();
    }
  
    function drawChart() {
      const years = [...new Set(data1.map(d => d.year))].sort();
  
      const protectedHousing = years.map(y =>
        totalByYear(data1, y, 'transaction_protected_housing')
      );
      const newHousing = years.map(y =>
        totalByYear(data1, y, 'transaction_new_housing')
      );
      const secondhandHousing = years.map(y =>
        totalByYear(data1, y, 'transaction_secondhand_housing')
      );
      const energySold = years.map(y =>
        totalByYear(data2, y, 'energy_sold')
      );
  
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: [
            'Protegida',
            'Nueva',
            'Segunda Mano',
            'Energía Vendida'
          ]
        },
        xAxis: {
          type: 'category',
          data: years
        },
        yAxis: {
          type: 'value',
          name: 'Cantidad'
        },
        series: [
          {
            name: 'Protegida',
            type: 'bar',
            stack: 'transacciones',
            data: protectedHousing
          },
          {
            name: 'Nueva',
            type: 'bar',
            stack: 'transacciones',
            data: newHousing
          },
          {
            name: 'Segunda Mano',
            type: 'bar',
            stack: 'transacciones',
            data: secondhandHousing
          },
          {
            name: 'Energía Vendida',
            type: 'bar',
            data: energySold
          }
        ]
      };
  
      const myChart = echarts.init(chartDiv);
      myChart.setOption(option);
      chart = myChart;
    }
  
    function totalByYear(data, year, field) {
      return data
        .filter(d => d.year == year)
        .reduce((acc, curr) => acc + (Number(curr[field]) || 0), 0);
    }
  
    onMount(() => {
      loadData();
      window.addEventListener('resize', () => chart?.resize());
    });
  </script>
  
  <h2>ntegración G21-home-buying-selling-stats</h2>
  <div bind:this={chartDiv} style="width: 100%; height: 500px;"></div>
  