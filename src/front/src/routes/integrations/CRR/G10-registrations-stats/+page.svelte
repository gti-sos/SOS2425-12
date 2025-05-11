<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    let chartDiv;
    let chart;
  
    async function loadData() {
      const ApexCharts = (await import('apexcharts')).default;
  
      const res1 = await fetch('https://sos2425-10.onrender.com/api/v1/registrations-stats');
      const data1 = await res1.json();
  
      const res2 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
      const data2 = await res2.json();
  
      const years = [...new Set(data1.map(d => d.year))]
        .filter(y => data2.some(e => e.year == y))
        .sort();
  
      const grouped = {};
      years.forEach(y => {
        grouped[y] = { total: 0, power: 0 };
      });
  
      data1.forEach(d => {
        if (grouped[d.year]) {
          grouped[d.year].total +=
            (d.total_general_national || 0) +
            (d.total_general_import || 0) +
            (d.total_general_auction || 0);
        }
      });
  
      data2.forEach(d => {
        if (grouped[d.year]) {
          grouped[d.year].power += d.installed_power || 0;
        }
      });
  
      const totalVehiculos = [], potencia = [];
      years.forEach(y => {
        totalVehiculos.push(grouped[y].total);
        potencia.push(grouped[y].power);
      });
  
      const options = {
        chart: {
          type: 'bar',
          height: 450,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        xaxis: {
          title: {
            text: 'Cantidad acumulada'
          }
        },
        yaxis: {
          categories: years,
          title: {
            text: 'Año'
          }
        },
        tooltip: {
          shared: true,
          intersect: false
        },
        series: [
          {
            name: 'Total vehículos',
            data: totalVehiculos
          },
          {
            name: 'Potencia instalada (MW)',
            data: potencia
          }
        ]
      };
  
      chart = new ApexCharts(chartDiv, options);
      chart.render();
    }
  
    onMount(loadData);
  </script>
  
  <h2>Integración G10-registrations-stats</h2>
  <div bind:this={chartDiv}></div>
  