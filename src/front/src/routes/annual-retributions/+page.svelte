<script>
//  @ts-nocheck
  import { onMount } from "svelte";

  let API = "http://localhost:16078/api/v1/annual-retributions";
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

<table>
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
        <td><button class="btn btn-info">Actualizar</button>
        <td><button class="btn btn-danger">Borrar</button></td>
      </tr>
    {/each}
</table>