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
  let techs = [];
  let selectedAacc = "";
  let selectedTech = "";

  onMount(async () => {
    const res = await fetch("/api/v1/annual-evolutions");
    data = await res.json();

    // Obtener listas únicas y ordenadas
    aaccs = [...new Set(data.map(d => d.aacc))].sort();
    techs = [...new Set(data.map(d => d.technology))].sort();

    drawChart();
  });

  function drawChart() {
    let filtered = data;

    if (selectedAacc) {
      filtered = filtered.filter(d => d.aacc === selectedAacc);
    }

    if (selectedTech) {
      filtered = filtered.filter(d => d.technology === selectedTech);
    }

    const grouped = {};
    filtered.forEach(d => {
      const year = d.year;
      if (!grouped[year]) {
        grouped[year] = { energy: 0, power: 0 };
      }
      grouped[year].energy += d.energy_sold;
      grouped[year].power += d.installed_power;
    });

    const categories = Object.keys(grouped).sort();
    const energy = categories.map(y => Number(grouped[y].energy.toFixed(2)));
    const power = categories.map(y => Number(grouped[y].power.toFixed(2)));

    Highcharts.chart('bar-container', {
      chart: { type: 'bar' },
      title: { text: 'Potencia instalada y Energía vendida por año' },
      xAxis: {
        categories,
        title: { text: 'Año' },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: { text: 'Cantidad' },
        labels: { overflow: 'justify' }
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

<!-- Selectores -->
<div>
  <label for="aacc">Selecciona comunidad:</label>
  <select id="aacc" bind:value={selectedAacc} on:change={drawChart}>
    <option value="">Todas</option>
    {#each aaccs as aacc}
      <option value={aacc}>{aacc}</option>
    {/each}
  </select>
</div>

<div>
  <label for="tech">Selecciona tecnología:</label>
  <select id="tech" bind:value={selectedTech} on:change={drawChart}>
    <option value="">Todas</option>
    {#each techs as tech}
      <option value={tech}>{tech}</option>
    {/each}
  </select>
</div>

<!-- Contenedor de la gráfica -->
<div id="bar-container" style="width: 100%; height: 500px;"></div>
