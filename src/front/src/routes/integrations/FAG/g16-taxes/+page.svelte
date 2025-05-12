<script>
  //@ts-nocheck
  import { onMount } from 'svelte';

  let taxesStats = [];
  let error = null;
  let selectedYear = '2020'; // Año por defecto
  let quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  let selectedQuarter = 'Q1';
  let chartData = [];
  let plotlyLoaded = false; // Variable para controlar si Plotly se ha cargado

  onMount(async () => {
    try {
      const res = await fetch('https://sos2425-16.onrender.com/api/v1/taxes-stats');
      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
      }
      taxesStats = await res.json();
      processDataForChart(selectedYear, selectedQuarter);
      loadPlotly(); // Llamar a la función para cargar Plotly
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });

  async function loadPlotly() {
    if (typeof window !== 'undefined') {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
        script.onload = () => {
          plotlyLoaded = true;
          updateChart(); // Intentar actualizar el gráfico después de cargar Plotly
          resolve();
        };
        script.onerror = () => {
          error = 'Error al cargar la biblioteca Plotly.';
          console.error(error);
          resolve();
        };
        document.head.appendChild(script);
      });
    }
  }

  function processDataForChart(year, quarter) {
    const filteredStats = taxesStats.filter(
      (stat) => stat.year === parseInt(year) && stat.quarter === quarter
    );
    const autonomousCommunities = [...new Set(filteredStats.map((stat) => stat.autonomic_community))].sort();
    const data = [
      {
        name: 'IRPF',
        type: 'bar',
        x: autonomousCommunities,
        y: autonomousCommunities.map(
          (community) => filteredStats.find((s) => s.autonomic_community === community)?.atr_irpf || 0
        ),
      },
      {
        name: 'Sociedades (No Consolidadas)',
        type: 'bar',
        x: autonomousCommunities,
        y: autonomousCommunities.map(
          (community) => filteredStats.find((s) => s.autonomic_community === community)?.atr_soc_no_consolidadas || 0
        ),
      },
      {
        name: 'IVA',
        type: 'bar',
        x: autonomousCommunities,
        y: autonomousCommunities.map(
          (community) => filteredStats.find((s) => s.autonomic_community === community)?.atr_iva || 0
        ),
      },
    ];
    chartData = data;
    if (plotlyLoaded) {
      updateChart();
    }
  }

  function updateChart() {
    if (!plotlyLoaded || !chartData) {
      return;
    }

    const layout = {
      barmode: 'group',
      title: `Recaudación por Tipo de Impuesto y CCAA (${selectedYear} - ${selectedQuarter})`,
      xaxis: { title: 'Comunidad Autónoma' },
      yaxis: { title: 'Recaudación (€)' },
    };

    Plotly.newPlot('taxes-chart', chartData, layout);
  }

  $: if (taxesStats.length > 0) {
    processDataForChart(selectedYear, selectedQuarter);
  }
</script>

<svelte:head>
  <title>Integración: Taxes Statistics (Grupo 16) - Plotly</title>
  </svelte:head>

<div class="container">
  <h1>Estadísticas de Impuestos (Grupo 16)</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if taxesStats.length === 0}
    <p>Cargando datos de estadísticas de impuestos...</p>
  {:else}
    <div>
      <label for="year-select">Seleccionar Año:</label>
      <select id="year-select" bind:value={selectedYear}>
        {#each [...new Set(taxesStats.map(stat => stat.year))].sort() as year}
          <option value={year}>{year}</option>
        {/each}
      </select>

      <label for="quarter-select">Seleccionar Trimestre:</label>
      <select id="quarter-select" bind:value={selectedQuarter}>
        {#each quarters as quarter}
          <option value={quarter}>{quarter}</option>
        {/each}
      </select>
    </div>
    <div id="taxes-chart"></div>
  {/if}
</div>

<style>
  .container {
    margin: 20px;
  }

  #taxes-chart {
    width: 100%;
    height: 500px;
    margin-top: 20px;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>