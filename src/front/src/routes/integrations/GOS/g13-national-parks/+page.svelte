<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/c3/c3.min.css" />
  <script src="https://d3js.org/d3.v5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/c3@0.7.20/c3.min.js"></script>
</svelte:head>


<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

let chartContainer;
let parksData = [];

onMount(async () => {
  const res = await fetch('/api/proxy-national-parks');
    if (!res.ok) {
        console.error('Error fetching data:', res.statusText);
        return;
    }
  parksData = await res.json();

  await waitForC3();
  drawChart();
});

function waitForC3() {
  return new Promise((resolve) => {
    const check = () => (typeof c3 !== 'undefined' ? resolve() : setTimeout(check, 50));
    check();
  });
}

function drawChart() {
  const columns = parksData.map(p => [p.national_park, p.current_area]);

  c3.generate({
    bindto: chartContainer,
    data: {
      columns,
      type: 'bar'
    },
    axis: {
      x: {
        type: 'category',
        categories: parksData.map(p => p.national_park),
        tick: { rotate: 75, multiline: false },
        height: 130
      },
      y: {
        label: {
          text: 'Área actual (ha)',
          position: 'outer-middle'
        }
      }
    },
    bar: {
      width: { ratio: 0.6 }
    }
  });
}
async function loadInitialData() {
        try {
            const res = await fetch('https://sos2425-13.onrender.com/api/v2/national-parks/loadInitialData');
            if (!res.ok) {
                console.error('Error loading initial data:', res.statusText);
                return;
            }
            alert('Datos iniciales cargados correctamente');
        } catch (error) {
            console.error('Error:', error);
        }
}
</script>

<h2>Parques Nacionales de España - Área actual</h2>
<div bind:this={chartContainer}></div>

<button class="pink" on:click={() => goto(`/integrations`)}>Atrás</button>
<button class="blue" on:click={loadInitialData}>Cargar Datos Iniciales</button>