<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

let data = [];
let years = [];
let communities = [];
let selectedYear = '';
let chartUrl = '';

onMount(async () => {
  const res = await fetch("https://sos2425-14.onrender.com/api/v1/education-data");
  data = await res.json();
  years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
  communities = [...new Set(data.map(d => d.autonomous_community))].filter(c => c !== 'TOTAL').sort();
  updateChart();
});

function updateChart() {
  if (!selectedYear) return;

  const filtered = data.filter(d => d.year === selectedYear && d.autonomous_community !== "TOTAL");

  const labels = filtered.map(d => d.autonomous_community);
  const basic = filtered.map(d => d.basic_fp);
  const middle = filtered.map(d => d.middle_grade);
  const higher = filtered.map(d => d.higher_grade);

  const chartConfig = {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'FP Básica',
          data: basic,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)'
        },
        {
          label: 'Grado Medio',
          data: middle,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)'
        },
        {
          label: 'Grado Superior',
          data: higher,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)'
        }
      ]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Distribución FP por comunidad en ${selectedYear}`
        }
      }
    }
  };

  chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
}
</script>

<style>
  select {
    margin: 0.5rem 0;
    padding: 0.3rem;
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
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
</style>

<h2>Radar de FP por Comunidad Autónoma</h2>

<div>
  <label for="year">Selecciona año:</label>
  <select id="year" bind:value={selectedYear} on:change={updateChart}>
    <option value="">-- Selecciona un año --</option>
    {#each years as y}
      <option value={y}>{y}</option>
    {/each}
  </select>
</div>

{#if chartUrl}
  <img src={chartUrl} alt="Radar FP por comunidad" />
{/if}

<button class="pink" on:click={() => goto(`/integrations`)}>Atrás</button>