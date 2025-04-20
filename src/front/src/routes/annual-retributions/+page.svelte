<script>
//  @ts-nocheck
  import { onMount } from "svelte";
  import { Button, Table } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
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

  let filtroAacc = "";
  let filtroTec = "";
  let filtroYearFrom = "";
  let filtroYearTo = "";
  

  async function getAnnualRetributions() {
    result = resultStatus = "";
    try {
      const res = await fetch(API, {method:"GET"});
      const data = await res.json();
      data.sort((a, b) => {return b.total_compensation - a.total_compensation});
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
          year: parseInt(newRetributionYear),
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
        console.log(`Retribution created`);
        getAnnualRetributions();
        newRetributionYear = newRetributionTechnology = "";
      } else {
        console.error(`Error creating Retribution; Status received: ${resultStatus}`);
      }
    } catch (error) {
      console.error("Error in POST to annual_retributions:", error);
    }
  }

  async function deleteAnnualRetribution(year, technology) {
    result = resultStatus = "";
    try {
      const res = await fetch(API+"/"+technology+"/"+year, {method:"DELETE"});
      const status = await res.status;
      resultStatus = status;
      if (resultStatus === 200) {  
        console.log(`Retribution deleted`);
        clearSearch();
      } else {
        console.error(`Error deleting Retribution; Status received: ${resultStatus}`);
      }
    } catch (error) {
      console.error("Error in DELETE from annual_retributions:", error);
    }
  }

  async function searchData() {
      result = "";
      let queryParams = [];

      if (filtroAacc) queryParams.push(`aacc=${encodeURIComponent(filtroAacc)}`);
      if (filtroYearFrom) queryParams.push(`from=${encodeURIComponent(filtroYearFrom)}`);
      if (filtroYearTo) queryParams.push(`to=${encodeURIComponent(filtroYearTo)}`);
      if (filtroTec) queryParams.push(`technology=${encodeURIComponent(filtroTec)}`);

      let finalUrl = API;
      if (queryParams.length) finalUrl += "?" + queryParams.join("&");

      try {
          const res = await fetch(finalUrl, { method: "GET" });

          if (res.status === 200) {
              const data = await res.json();
              data.sort((a, b) => {return b.total_compensation - a.total_compensation});
              annual_retributions = data;
              resultStatus = 200;
              if (annual_retributions.length === 0) {
                  resultStatus = 404;
              }
          } else {
              alert(`Error al realizar la búsqueda (código ${res.status})`);
          }
      } catch (error) {
          alert(`Error al conectar con el servidor: ${error}`);
      }
  }

  function clearCreation() {
    newRetributionYear = newRetributionTechnology = "";
    newRetributionSubsidizedEnergy = "";
    newRetributionTotalCompensation = "";
    newRetributionInvestmentCompensation = "";
    newRetributionOperationCompensation = "";
    newRetributionSpecificCompensation = "";
    newRetributionAACC = "";
  }

  function clearSearch() {
    filtroAacc = filtroTec = filtroYearFrom = filtroYearTo = "";
    getAnnualRetributions();
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

<head>
  <title>Retribución Anual</title>
</head>

<h2 style="padding: 1.5%;">Retribución Anual</h2>

<div class="text-center mb-2">
  {#if resultStatus === 201}
      <i class="bi bi-check-circle-fill text-success"></i> DATO CREADO CORRECTAMENTE.
  {:else if resultStatus === 200}
      <i class="bi bi-check-circle-fill text-success"></i> OPERACIÓN COMPLETADA CORRECTAMENTE.
  {:else if resultStatus === 400}
      <i class="bi bi-exclamation-triangle-fill text-warning"></i> FALTAN DATOS REQUERIDOS.
  {:else if resultStatus === 409}
      <i class="bi bi-x-circle-fill text-danger"></i> YA EXISTE ESTE DATO.
  {:else if resultStatus === 404}
      <i class="bi bi-x-circle-fill text-danger"></i> DATO NO ENCONTRADO.

  {/if}
</div>

<Table>
  <thead>
    <tr>

      <th style="margin-bottom: 1rem;">
        <td>
        <select bind:value={filtroAacc} class="form-select">
          <option value="" disabled selected>Comunidad autónoma</option>
          <option value="Andalucía">Andalucía</option>
          <option value="Asturias, Principado de">Principado de Asturias</option>
          <option value="Cataluña">Cataluña</option>
          <option value="Galicia">Galicia</option>
          <option value="Murcia, Región de">Región de Murcia</option>
          <option value="País Vasco">País Vasco</option>
        </select>         
      </td>
      <td>
          <select bind:value={filtroYearFrom} class="form-select">
          <option value="" disabled selected>Año (inicio)</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>          
      </td>
      <td>
        <select bind:value={filtroYearTo} class="form-select">
          <option value="" disabled selected>Año (fin)</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select> 
       </td>
      <td>
        <select bind:value={filtroTec} class="form-select">
          <option value="" disabled selected>Tecnología</option>
          <option value="Biomasa">Biomasa</option>
          <option value="Cogeneración">Cogeneración</option>
          <option value="Eólica">Eólica</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Residuos">Residuos</option>
          <option value="Solar FV">Solar FV</option>
          <option value="Trat.residuos">Trat.residuos</option>
          <option value="Otras tecn. renovables">Otras tecn. renovables</option>
        </select>        
      </td>
      <td>
        <Button color="primary" on:click={searchData}> Buscar</Button>
        <Button color="secondary" on:click={clearSearch}> Limpiar</Button>
      </td>
    </tr>
  </thead>
</Table>

<div id="body">
  <Table id="data-table">
    <thead>
      <tr>
        <th>Año</th>
        <th>Tecnología</th>
        <th>Energía Subvencionada</th>
        <th>Compensación total</th>
        <th>Compensación por inversión</th>
        <th>Compensación por operación</th>
        <th>Compensación específica</th>
        <th>CCAA</th>
        <th>Acciones</th>
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
          <td>
            <Button color="primary" on:click={createAnnualRetribution}>Crear</Button>
            <Button color="secondary" on:click={clearCreation}>Limpiar</Button>
          </td>
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
          <Button color="info" on:click={() => goto(`/annual-retributions/${retribution.technology}/${retribution.year}`)}>Actualizar</Button>
          <Button color="danger" on:click={() => {deleteAnnualRetribution(retribution.year, retribution.technology)}}>Borrar</Button>
          </td>
        </tr>
      {/each}
  </Table>

</div>

