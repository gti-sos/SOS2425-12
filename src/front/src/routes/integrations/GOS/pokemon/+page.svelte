<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/c3/c3.min.css" />
  <script src="https://d3js.org/d3.v5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/c3@0.7.20/c3.min.js"></script>
</svelte:head>

<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { goto } from '$app/navigation';


let chartDiv;

onMount(async () => {
  const res = await fetch('https://pokeapi.co/api/v2/type/');
  const data = await res.json();

  // Para cada tipo, hacer fetch y contar Pokémon
  const typeData = await Promise.all(
    data.results.map(async (type) => {
      const res = await fetch(type.url);
      const full = await res.json();
      return [type.name, full.pokemon.length];
    })
  );

  c3.generate({
    bindto: chartDiv,
    data: {
      columns: typeData,
      type: 'donut'
    },
    donut: {
      title: "Pokémon por tipo"
    }
  });
});
</script>

<h2>Distribución de Pokémon por tipo (PokéAPI)</h2>
<div bind:this={chartDiv}></div>

<button class="pink" on:click={() => goto(`/integrations`)}>Atrás</button>