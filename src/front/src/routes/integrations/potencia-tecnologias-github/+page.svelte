<script>
// @ts-nocheck
import { onMount } from 'svelte';
import Chart from 'chart.js/auto';

let chart;
let chartDiv;
let githubUser = null;
let energiaAgrupada = [];

async function fetchGithubUser(code) {
  const res = await fetch(`http://localhost:3000/callback?code=${code}`);
  const data = await res.json();
  githubUser = data;
}

async function fetchEnergias() {
  const res = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
  const data = await res.json();

  const filtered = data.filter(d => d.year === 2024);
  const grouped = {};

  filtered.forEach(d => {
    if (!grouped[d.technology]) {
      grouped[d.technology] = 0;
    }
    grouped[d.technology] += d.installed_power;
  });

  energiaAgrupada = Object.entries(grouped).map(([tech, power]) => ({
    technology: tech,
    power: parseFloat(power.toFixed(2))
  }));
}

function drawChart() {
    console.log(chartDiv); // ← esto debe mostrar <canvas>...
  const ctx = chartDiv.getContext('2d');
  chart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: energiaAgrupada.map(d => d.technology),
      datasets: [{
        label: 'Potencia instalada (MW)',
        data: energiaAgrupada.map(d => d.power),
        backgroundColor: [
          '#f6f48f', '#f68fb4', '#91cc75', '#73c0de',
          '#fac858', '#ee6666', '#3ba272', '#fc8452'
        ]
      }]
    },
    options: {
      responsive: false, // evita que ignore el width/height
      plugins: {
        title: {
          display: true,
          text: githubUser
            ? `Potencia instalada (2024) - ${githubUser.login}`
            : 'Potencia instalada (2024)',
          font: { size: 18 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.formattedValue} MW`
          }
        }
      }
    }
  });
}

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const login = params.get('login');
    if (login) githubUser = { login };
    await fetchEnergias();
    drawChart();
  });
</script>

<h2>Potencia Instalada por Tecnología - Chart.js</h2>
{#if !githubUser}
    <button on:click={() => window.location.href = 'http://localhost:3000/auth/github'}>
    Iniciar sesión con GitHub
    </button>
{/if}

<canvas bind:this={chartDiv} width="400" height="400"></canvas>
