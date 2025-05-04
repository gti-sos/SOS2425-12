<script>
  // @ts-nocheck
  import { dev } from "$app/environment"; 
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { Button, Table } from '@sveltestrap/sveltestrap';

  let DEVEL_HOST = "http://localhost:16078";
  let API = "/api/v1/annual-consumptions/" + $page.params.aacc + "/" + $page.params.year;
  if (dev) API = DEVEL_HOST + API;

  let consumption_data = {};
  let result = "";
  let resultStatus = "";

  async function getConsumption() {
      result = "";
      try {
          const res = await fetch(API, { method: "GET" });
          const loaded = await res.json();
          result = JSON.stringify(loaded, null, 2);
          console.log(`Datos recibidos:\n${loaded}`);
          consumption_data = loaded;
          console.log(`Datos recibidos:\n${JSON.stringify(consumption_data, null, 2)}`);
      } catch (error) {
          console.log(`ERROR al obtener datos desde ${API}: ${error}`);
      }
  }

  async function editConsumption() {
      result = "";
      try {
          const res = await fetch(API, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  aacc: consumption_data.aacc,
                  year: consumption_data.year,
                  electricity: parseInt(consumption_data.electricity),
                  gas: parseInt(consumption_data.gas),
                  other: parseInt(consumption_data.other),
                  total_consumption: parseInt(consumption_data.total_consumption),
                  co2_emission: parseInt(consumption_data.co2_emission)
              })
          });
          const status = await res.status;
          resultStatus = status;
          if (status === 200) {
              console.log(`Datos actualizados`);
              getConsumption();
          } else {
              console.log(`Error actualizando: status ${status}`);
          }
      } catch (error) {
          console.log(`ERROR al actualizar: ${error}`);
      }
  }

  onMount(async () => {
      getConsumption();
  });
</script>

<head>
  <title>Editor de consumo</title>
</head>

<h2>Consumo Anual: {consumption_data.aacc}, {consumption_data.year}</h2>

<div class="text-center mb-2">
  {#if resultStatus === 200}
      OPERACIÓN COMPLETADA CORRECTAMENTE.
  {:else if resultStatus === 400}
      FALTAN DATOS REQUERIDOS.
  {/if}
</div>

<Table>
  <thead>
      <tr>
          <th>Año</th>
          <th>CCAA</th>
          <th>Electricidad</th>
          <th>Gas</th>
          <th>Otros</th>
          <th>Total Consumo</th>
          <th>Emisión CO₂</th>
          <th>Acciones</th>
      </tr>
  </thead>

  <tbody>
      <tr>
          <td>{consumption_data.year}</td>
          <td>{consumption_data.aacc}</td>
          <td><input type="text" bind:value={consumption_data.electricity}></td>
          <td><input type="text" bind:value={consumption_data.gas}></td>
          <td><input type="text" bind:value={consumption_data.other}></td>
          <td><input type="text" bind:value={consumption_data.total_consumption}></td>
          <td><input type="text" bind:value={consumption_data.co2_emission}></td>
          <td><Button color="success" on:click={editConsumption}>Actualizar</Button></td>
      </tr>
  </tbody>
</Table>

<Button color="secondary" on:click={() => goto(`/annual-consumptions`)}>Atrás</Button>
