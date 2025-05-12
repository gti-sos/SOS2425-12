<script>
  //@ts-nocheck
  import { onMount } from 'svelte';

  let waterSupplyImprovements = [];
  let error = null;

  onMount(async () => {
    try {
      const res = await fetch('https://sos2425-13.onrender.com/api/v1/water-supply-improvements');
      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
      }
      waterSupplyImprovements = await res.json();
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Integración: Water Supply Improvements</title>
</svelte:head>

<div class="container">
  <h1>Mejoras en el suministro de agua</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if waterSupplyImprovements.length === 0}
    <p>Cargando datos...</p>
  {:else}
    <table class="data-table">
      <thead>
        <tr>
          <th>Año</th>
          <th>Comunidad Autónoma</th>
          <th>Cantidad (€)</th>
          <th>Población Beneficiada</th>
          <th>Número de Proyectos</th>
        </tr>
      </thead>
      <tbody>
        {#each waterSupplyImprovements as improvement}
          <tr>
            <td>{improvement.year}</td>
            <td>{improvement.autonomous_community}</td>
            <td>{improvement.amount}</td>
            <td>{improvement.benefited_population}</td>
            <td>{improvement.project_count}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .container {
    margin: 20px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .data-table th,
  .data-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .data-table th {
    background-color: #f2f2f2;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>