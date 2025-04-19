<script>
//  @ts-nocheck
  import { onMount } from "svelte";
  import { Button, Table } from "@sveltestrap/sveltestrap";
  import { dev } from "$app/environment";

  let DEVEL_HOST = "http://localhost:16078";
  let API = "/api/v1/annual-retributions";
  if (dev) {
    API = DEVEL_HOST + API;
  }
  let annual_retributions = [];
  let result = "";
  let resultStatus = "";

  let newRetributionYear = "";
  let newRetributionTechnology = "";
  let newRetributionSubsidizedEnergy = "";
  let newRetributionTotalCompensation = "";
  let newRetributionInvestmentCompensation = "";
  let newRetributionOperationCompensation = "";
  let newRetributionSpecificCompensation = "";
  let newRetributionAACC = "";

  async function getAnnualRetributions() {
    result = resultStatus = "";
    try {
      const res = await fetch(API, {method:"GET"});
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      annual_retributions = data;
      console.log(`Received data:`, annual_retributions);

    } catch (error) {
      console.error("Error in GET from annual_retributions:", error);
    }
  }

  async function createAnnualRetribution() {
    result = resultStatus = "";
    try {
      const res = await fetch(API, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: newRetributionYear,
          technology: newRetributionTechnology,
          subsidized_energy: newRetributionSubsidizedEnergy,
          total_compensation: newRetributionTotalCompensation,
          investment_compensation: newRetributionInvestmentCompensation,
          operation_compensation: newRetributionOperationCompensation,
          specific_compensation: newRetributionSpecificCompensation,
          aacc: newRetributionAACC
        })
      });
      const status = await res.status;
      resultStatus = status;
      if (resultStatus === 201) {  
        console.log(`Contact created`);
        location.reload();
      } else {
        console.error(`Error creating contact; Status received: ${resultStatus}`);
      }
    } catch (error) {
      console.error("Error in GET from annual_retributions:", error);
    }
  }

  onMount(async () => {
    getAnnualRetributions();
  });
</script>

<style>
  div#body {
    margin: 1%; 
  }
  th, td {
    border: 0.5px solid #e2e2e2;
  }
</style>

<div id="body">
  <Table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Technology</th>
        <th>Subsidized Energy</th>
        <th>Total Compensation</th>
        <th>Investment Compensation</th>
        <th>Operation Compensation</th>
        <th>Specific Compensation</th>
        <th>AACC</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td><input bind:value={newRetributionYear}> </td>
          <td><input bind:value={newRetributionTechnology}> </td>
          <td><input bind:value={newRetributionSubsidizedEnergy}> </td>
          <td><input bind:value={newRetributionTotalCompensation}> </td>
          <td><input bind:value={newRetributionInvestmentCompensation}> </td>
          <td><input bind:value={newRetributionOperationCompensation}> </td>
          <td><input bind:value={newRetributionSpecificCompensation}> </td>
          <td><input bind:value={newRetributionAACC}> </td>
          <td><Button color="primary" on:click={createAnnualRetribution}>Crear</Button></td>
        </tr>
      {#each annual_retributions as retribution}
        <tr>
          <td>{retribution.year}</td>
          <td>{retribution.technology}</td>
          <td>{retribution.subsidized_energy}</td>
          <td>{retribution.total_compensation}</td>
          <td>{retribution.investment_compensation}</td>
          <td>{retribution.operation_compensation}</td>
          <td>{retribution.specific_compensation}</td>
          <td>{retribution.aacc}</td>
          <td>
          <Button color="info">Actualizar</Button>
          <Button color="danger">Borrar</Button>
          </td>
        </tr>
      {/each}
  </Table>

</div>

