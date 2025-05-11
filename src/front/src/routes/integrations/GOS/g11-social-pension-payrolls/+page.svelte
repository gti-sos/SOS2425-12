<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>
</svelte:head>

<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

let data = [];
let places = [];
let years = [];
let selectedYear = "";

onMount(async () => {
  const res = await fetch("https://sos2425-11.onrender.com/api/v1/social-pension-payrolls");
  data = await res.json();
  places = [...new Set(data.map(d => d.place))].sort();
  years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
  updateChart();
});

function updateChart() {
  if (!selectedYear) return;

  const filtered = data.filter(d => d.year === selectedYear);

  const categories = places;
  const values = categories.map(place => {
    const entry = filtered.find(d => d.place === place);
    return entry ? Number(entry.retirement_amount) : 0;
  });

  new Chartist.Bar('.ct-chart', {
    labels: categories,
    series: [values]
  }, {
    horizontalBars: false,
    axisY: {
      onlyInteger: true
    },
    axisX: {
      offset: 80
    },
    chartPadding: {
      top: 20,
      right: 30,
      bottom: 40,
      left: 10
    },
    height: 500
  });
}
</script>

<style>
  .ct-chart {
    height: 500px;
  }

  select {
    margin: 0.5rem 0;
    padding: 0.3rem;
  }

  button.pink {
    background-color: #ff69b4;
    color: white;
    border: 1px solid #c71585;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button.pink:hover {
    background-color: #c71585;
    border-color: #c71585;
  }

  .controls {
    margin-bottom: 1rem;
  }
</style>

<h2>Comparativa de pensiones por comunidad</h2>

<div class="controls">
  <label for="year">Selecciona año:</label>
  <select id="year" bind:value={selectedYear} on:change={updateChart}>
    <option value="">-- Selecciona un año --</option>
    {#each years as y}
      <option value={y}>{y}</option>
    {/each}
  </select>
</div>

{#if selectedYear}
  <div class="ct-chart ct-major-twelfth"></div>
{/if}

<button class="pink" on:click={() => goto(`/integrations-GOS`)}>Atrás</button>
