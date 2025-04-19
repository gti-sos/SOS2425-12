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

  onMount(async () => {
    getAnnualRetributions();
  });
</script>

<style>
  div#body {
    font-family: Arial;
    border: #cecdcd solid 1px;
    margin: 2%;
    padding: 0.5%;
  }
  /* table {
    width: 100%;
    border-collapse: collapse;
  } */
  th, td {
    border: 1px solid #cecdcd;
    padding: 8px;
  }
  th {
    background-color: #aca5a5c2;
    text-align: left;
  }
</style>

<div id="body">
  <Table>
    <!-- year: 2018,
    technology: "Cogeneración",
    subsidized_energy: 25935.3492,
    total_compensation: 2713723.05,
    investment_compensation: 81485.92,
    operation_compensation: 1127022.62,
    specific_compensation: 1208508.54,
    aacc: "Asturias, Principado de" -->
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