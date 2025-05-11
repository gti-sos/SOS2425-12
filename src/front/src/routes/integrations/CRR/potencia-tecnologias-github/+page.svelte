<script>
// @ts-nocheck
import { onMount } from 'svelte';
import Chart from 'chart.js/auto';

let chart;
let chartDiv;
let githubUser = null;
let energiaAgrupada = [];

async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const login = params.get('login');

  // Si no hay login ni code, no mostramos nada aún
  if (!code && !login) return;

  // Si tenemos login por la URL
  if (login) {
    githubUser = { login };
  }

  // Si venimos de GitHub con un code, pedimos el usuario
  if (code) {
    const res1 = await fetch(`https://sos2425-12.onrender.com/api/github/callback?code=${code}`);
    const data1 = await res1.json();
    githubUser = data1;
    // Redirigimos con el login para evitar que el code quede en la URL
    window.location.href = `/integrations/CRR/potencia-tecnologias-github?login=${githubUser.login}`;
    return;
  }

  // Cargamos datos solo si el usuario ha iniciado sesión
  const res2 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
  const data2 = await res2.json();

  const filtered = data2.filter(d => d.year === 2024);
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

  drawChart();
}

function drawChart() {
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
      responsive: false,
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

onMount(loadData);
</script>

<h2>Potencia Instalada por Tecnología - Chart.js</h2>

{#if !githubUser}
  <button color="dark" on:click={() => window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23linopbdyVmeNezLw&redirect_uri=http://sos2425-12.onrender.com/api/github/callback'}>
    Iniciar sesión con GitHub
  </button>
{/if}

{#if githubUser}
  <canvas bind:this={chartDiv} width="400" height="400"></canvas>
{/if}
