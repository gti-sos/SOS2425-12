<script>
// @ts-nocheck
  import { onMount } from "svelte";
  import { Button, Table } from "@sveltestrap/sveltestrap";
  import { dev } from "$app/environment";

  let DEVEL_HOST = "http://localhost:16078";
  let API = "/api/v1/annual-consumptions";

  if (dev) {
      API = DEVEL_HOST + API;
  }

  let annual_consumptions = [];
  let result = "";
  let resultStatus = null;

  let newConsumptionAACC = "";
  let newConsumptionYear = "";
  let newConsumptionElectricity = "";
  let newConsumptionGas = "";
  let newConsumptionOther = "";
  let newConsumptionTotalConsumption = "";
  let newConsumptionCO2Emission = "";
  
  async function getAnnualConsumptions() {
      resultStatus = result = "";
      try {  
          const res = await fetch(API,{method:"GET"});
          const data = await res.json();
          result = JSON.stringify(data,null,2);
          annual_consumptions = data;
          console.log(`Response recieved`, annual_consumptions);
          
      } 
      catch (error) {
          console.log(`ERROR: GET from ${API}: ${error}`)
      }
  }

  async function createAnnualConsumption() {
      result = "";
      resultStatus = null;
      try {
          const res = await fetch(API, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  aacc: newConsumptionAACC,
                  year: parseInt(newConsumptionYear),
                  electricity: parseFloat(newConsumptionElectricity),
                  gas: parseFloat(newConsumptionGas),
                  other: parseFloat(newConsumptionOther),
                  total_consumption: parseFloat(newConsumptionTotalConsumption),
                  co2_emission: parseFloat(newConsumptionCO2Emission)
              })
          });
          const status = await res.status;
          
          resultStatus = status;
          
          if (resultStatus === 201) {
              console.log(`Consumption created`);
              getAnnualConsumptions();
          }
          else {
              console.error(`Error creating Retribution; Status received: ${resultStatus}`);
          }
      } catch (error) {
          console.error(`ERROR: POST to ${API}: ${error}`);
      }
  }

  async function deleteAnnualConsumption(aacc, year) {
      result = resultStatus = "";
      try {
          const res = await fetch(API+"/"+aacc+"/"+year, {method: "DELETE"});
          const status = await res.status;
          resultStatus = status;
          if (resultStatus === 200) {
              console.log(`Consumption deleted`);
              getAnnualConsumptions();
          }
          else {
              console.error(`Error deleting Consumption; Status received: ${resultStatus}`);
          }
      } catch (error) {
          console.error(`ERROR: DELETE to ${API}: ${error}`);
      }
  }

  onMount(async () => {
      getAnnualConsumptions();
  })

</script>

<style>
  div#body {
    margin: 2%;
  }
  th,
  td {
    border: 0.5px solid #a19f9f;
  }

  button.primary {
    background-color: #007bff;
    color: white;
    border: 1px solid #003064;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button.primary:hover {
    background-color: #003064;
    border-color: #003064;
  }

  button.info {
    background-color: #fcd600;
    color: black;
    border: 1px solid #7a6800;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button.info:hover {
    background-color: #7a6800;
    border-color: #7a6800;
  }


  button.danger {
    background-color: #dc3545;
    color: white;
    border: 1px solid #770511;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button.danger:hover {
    background-color: #770511;
    border-color: #770511;
  }
</style>

<div id="body">
  <Table>
    <thead>
      <tr>
        <th>AACC</th>
        <th>Year</th>
        <th>Electricity</th>
        <th>Gas</th>
        <th>Other</th>
        <th>Total Consumption</th>
        <th>CO2 Emission</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input bind:value={newConsumptionAACC}></td>
        <td><input bind:value={newConsumptionYear}></td>
        <td><input bind:value={newConsumptionElectricity}></td>
        <td><input bind:value={newConsumptionGas}></td>
        <td><input bind:value={newConsumptionOther}></td>
        <td><input bind:value={newConsumptionTotalConsumption}></td>
        <td><input bind:value={newConsumptionCO2Emission}></td>
        <td><button class="primary" on:click={createAnnualConsumption}>Crear</button></td>
      </tr>
      {#each annual_consumptions as consumption}
        <tr>
          <td>{consumption.aacc}</td>
          <td>{consumption.year}</td>
          <td>{consumption.electricity}</td>
          <td>{consumption.gas}</td>
          <td>{consumption.other}</td>
          <td>{consumption.total_consumption}</td>
          <td>{consumption.co2_emission}</td>
          <td style="white-space: nowrap;">
            <button class="info">Actualizar</button>
            <button class="danger" on:click={() => {deleteAnnualConsumption(consumption.aacc, consumption.year)}}>Borrar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>