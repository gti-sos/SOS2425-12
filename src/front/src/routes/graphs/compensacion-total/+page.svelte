<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
  // @ts-nocheck
  import { onMount, onDestroy } from "svelte";

  let data = [];
  let chartInstance = null;
  let fromYear = "";
  let toYear = "";
  let allYears = [];

  onMount(async () => {
    const resAll = await fetch("/api/v2/annual-retributions");
    const allData = await resAll.json();
    allYears = [...new Set(allData.map(d => d.year))].sort();
    fetchRetributions();
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });

  $: fetchRetributions(fromYear, toYear);

  const fetchRetributions = async (from = "", to = "") => {
    let url = "/api/v2/annual-retributions";
    const params = new URLSearchParams();
    if (from) {
      params.append("from", from);
    }
    if (to) {
      params.append("to", to);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    console.log("Fetching URL:", url); // Para depuración
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Error fetching data from ${url}: ${res.status} - ${errorBody}`);
        return;
      }
      data = await res.json();
      drawTotalCompensationChart();
    } catch (error) {
      console.error("Error en la petición fetch:", error);
    }
  };

  function drawTotalCompensationChart() {
    const ctx = document.getElementById("totalCompensationChart").getContext("2d");

    if (chartInstance) {
      chartInstance.destroy();
    }

    const groupedData = {};
    data.forEach((objeto) => {
      if (!groupedData[objeto.year]) {
        groupedData[objeto.year] = {};
      }
      if (!groupedData[objeto.year][objeto.technology]) {
        groupedData[objeto.year][objeto.technology] = 0;
      }
      groupedData[objeto.year][objeto.technology] += objeto.total_compensation;
    });

    const labels = Object.keys(groupedData).sort(); // Aseguramos que las etiquetas estén ordenadas
    const datasets = Object.keys(groupedData[labels[0]] || {}).map((technology) => {
      return {
        label: technology,
        data: labels.map((year) => groupedData[year][technology] || 0),
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Genera colores aleatorios
      };
    });

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Compensación Total",
            },
          },
          x: {
            title: {
              display: true,
              text: "Año",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      },
    });
  }
</script>

<h2>Compensación Total por Tecnología y Año</h2>

<div>
  <label for="fromYear">Año de Inicio:</label>
  <select id="fromYear" bind:value={fromYear}>
    <option value="">Todos</option>
    {#each allYears as year}
      <option value={year}>{year}</option>
    {/each}
  </select>

  <label for="toYear">Año de Fin:</label>
  <select id="toYear" bind:value={toYear}>
    <option value="">Todos</option>
    {#each allYears as year}
      <option value={year}>{year}</option>
    {/each}
  </select>
</div>

<div style="width:100%; height:400px;">
  <canvas id="totalCompensationChart"></canvas>
</div>

<style>
  div {
    margin-bottom: 15px;
  }

  label {
    margin-right: 10px;
  }

  select {
    padding: 5px;
  }
</style>