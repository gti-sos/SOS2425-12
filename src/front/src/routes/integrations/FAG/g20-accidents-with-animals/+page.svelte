<script>
  // @ts-nocheck
  import { onMount, tick } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  let accidents = [];
  let error = null;
  let chart;
  let chartCanvas; // Referencia al elemento canvas

  onMount(async () => {
    try {
      const res = await fetch('https://sos2425-20.onrender.com/api/v1/accidents-with-animals');
      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
      }
      accidents = await res.json();
      await tick(); // Esperar a que el DOM se actualice
      processDataForChart();
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });

  function processDataForChart() {
    const communityCounts = accidents.reduce((acc, current) => {
      acc[current.autonomous_community] = (acc[current.autonomous_community] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(communityCounts);
    const data = Object.values(communityCounts);
    const backgroundColors = generateColors(labels.length);

    if (chart) {
      chart.destroy();
    }

    // Intentar obtener el contexto solo si chartCanvas tiene una referencia
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      if (ctx) {
        chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Número de Accidentes',
              data: data,
              backgroundColor: backgroundColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Distribución de Accidentes por Comunidad Autónoma'
              }
            }
          }
        });
      } else {
        console.error("No se pudo obtener el contexto 2D del canvas.");
      }
    } else {
      console.error("El elemento canvas con ID 'accidentsChart' no se encontró.");
    }
  }

  function generateColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    return colors;
  }
</script>

<svelte:head>
  <title>Distribución de Accidentes (Grupo 20) - Chart.js</title>
</svelte:head>

<div class="container">
  <h1>Distribución de Accidentes con Animales por Comunidad Autónoma (Grupo 20)</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if accidents.length === 0}
    <p>Cargando datos de accidentes...</p>
  {:else}
    <div style="height: 400px;">
      <canvas id="accidentsChart" bind:this={chartCanvas}></canvas>
    </div>
  {/if}
</div>

<style>
  .container {
    margin: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  #accidentsChart {
    width: 100% !important;
    height: 100% !important;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>