<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from "svelte";
  
    let data = [];
    let aaccs = [];
    let selectedAacc = "";
  
    onMount(async () => {
      const res = await fetch("/api/v1/annual-evolutions");
      data = await res.json();
      aaccs = [...new Set(data.map(d => d.aacc))].sort();
      drawChart();
    });
  
    function drawChart() {
      let filtered = selectedAacc
        ? data.filter(data => data.aacc === selectedAacc)
        : data;
  
      const grouped = {};
      filtered.forEach(data => {
        const year = data.year;
        if (!grouped[year]) {
          grouped[year] = { energy: 0, power: 0 };
        }
        grouped[year].energy += data.energy_sold;
        grouped[year].power += data.installed_power;
      });
  
      const categories = Object.keys(grouped).sort();
      const energy = categories.map(y => Number(grouped[y].energy.toFixed(2)));
      const power = categories.map(y => Number(grouped[y].power.toFixed(2)));
  
      Highcharts.chart('bar-container', {
        chart: { type: 'bar' },
        title: { text: 'Potencia instalada y Energía vendida por año' },
        xAxis: {
          categories: categories,
          title: { text: 'Año' },
          gridLineWidth: 1,
          lineWidth: 0
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Cantidad'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: { shared: true },
        plotOptions: {
          bar: {
            borderRadius: 5,
            dataLabels: { enabled: true },
            groupPadding: 0.1
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFF',
          shadow: true
        },
        credits: { enabled: false },
        series: [
          {
            name: 'Energía vendida (MWh)',
            data: energy,
            color: '#00c853'
          },
          {
            name: 'Potencia instalada (MW)',
            data: power,
            color: '#6200ea'
          }
        ]
      });
    }
  </script>
  