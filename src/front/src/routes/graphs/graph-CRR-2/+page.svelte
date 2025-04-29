<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
</svelte:head>

<script>
  // @ts-nocheck
  import { onMount } from "svelte";

  let data = [];
  let years = [];
  let aaccs = [];
  let selectedYear = "";

  import { tick } from 'svelte';

onMount(async () => {
  const res = await fetch("/api/v1/annual-evolutions");
  data = await res.json();
  years = [...new Set(data.map(d => d.year))].sort();
  aaccs = [...new Set(data.map(d => d.aacc))].sort();
  selectedYear = ""; // opción por defecto

  await tick();     // espera a que el DOM con los charts se genere
  drawCharts();     // los div ya existen y echarts funciona
});


  $: selectedYear, drawCharts();

  function drawCharts() {
    if (typeof window === 'undefined') return;

    const techColors = {
      "Biomasa": "#979ff2",
      "Cogeneración": "#f297dc",
      "Eólica": "#98f297",
      "Hidráulica": "#f2eb97",
      "Solar FV": "#97e1f2",
      "Residuos": "#ffb347",
      "Trat.residuos": "#b0e0e6"
    };

    aaccs.forEach(aacc => {
      const containerId = `rose-chart-${aacc.replace(/\s/g, "-")}`;
      const container = document.getElementById(containerId);
      if (!container || !window.echarts) return;

      const filtered = [];
      for (const d of data) {
        if (d.aacc === aacc && (selectedYear === "" || d.year == selectedYear)){
          filtered.push(d);
        } 
}
      const grouped = {};

      filtered.forEach(d => {
        if (!grouped[d.technology]) {
          grouped[d.technology] = { total: 0, count: 0 };
        }
        grouped[d.technology].total += d.load_factor;
        grouped[d.technology].count++;
      });

      const seriesData = Object.entries(grouped).map(([tech, val]) => ({
        name: tech,
        value: (val.total / val.count).toFixed(2),
        itemStyle: { color: techColors[tech] || "#ccc" }
      }));

      if (window.echarts.getInstanceByDom(container)) {
        window.echarts.getInstanceByDom(container).dispose();
      }

      const chart = window.echarts.init(container);

      chart.setOption({
        title: {
          text: aacc,
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "bottom"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: [30, 110],
            roseType: "radius",
            data: seriesData
          }
        ]
      });
    });
  }
</script>

<h2>Factor de carga medio por tecnología</h2>

<!-- Selector de Año -->
<label for="year">Selecciona un año:</label>
<select id="year" bind:value={selectedYear}>
  <option value=""> Todos </option>
  {#each years as year}
    <option value={year}>{year}</option>
  {/each}
</select>

<!-- Contenedores de gráficas -->
<div class="grid-container">
  {#each aaccs as aacc}
    <div class="chart-box">
      <div id={"rose-chart-" + aacc.replace(/\s/g, "-")} class="chart"></div>
    </div>
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .chart-box {
    width: 100%;
    height: auto;
    text-align: center;
  }

  .chart {
    width: 100%;
    height: 400px;
  }

  button {
    margin-top: 10px;
    padding: 6px 12px;
    font-size: 0.9rem;
    cursor: pointer;
  }
</style>
