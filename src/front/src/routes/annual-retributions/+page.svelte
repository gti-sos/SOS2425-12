<!-- @ts-nocheck -->
<script>
  //  @ts-nocheck
  import { onMount } from "svelte";
  import { Button, Table, Input, Icon } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
  import { dev } from "$app/environment";

  let DEVEL_HOST = "http://localhost:16078";
  let API = "/api/v2/annual-retributions";
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
  let filtro_subsidized_energy = "";
  let filtro_total_compensation = "";
  let filtro_investment_compensation = "";
  let filtro_operation_compensation = "";
  let filtro_specific_compensation = "";
  
  let advancedSearch = false;

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

  async function deleteAnnualRetributions() {
    result = resultStatus = "";
    try {
      const res = await fetch(API, {method:"DELETE"});
      const status = await res.status;
      resultStatus = status;
      if (resultStatus === 200) {  
        console.log(`All Retributions deleted`);
        clearSearch();
      } else {
        console.error(`Error deleting all Retributions; Status received: ${resultStatus}`);
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
      if (filtro_subsidized_energy) queryParams.push(`subsidized_energy=${encodeURIComponent(parseFloat(filtro_subsidized_energy))}`);
      if (filtro_total_compensation) queryParams.push(`total_compensation=${encodeURIComponent(parseFloat(filtro_total_compensation))}`);
      if (filtro_investment_compensation) queryParams.push(`investment_compensation=${encodeURIComponent(parseFloat(filtro_investment_compensation))}`);
      if (filtro_operation_compensation) queryParams.push(`operation_compensation=${encodeURIComponent(parseFloat(filtro_operation_compensation))}`);
      if (filtro_specific_compensation) queryParams.push(`specific_compensation=${encodeURIComponent(parseFloat(filtro_specific_compensation))}`);

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
    clearAdvancedSearch();
    searchData();
  }

  function clearAdvancedSearch() {
    filtro_subsidized_energy = "";
    filtro_total_compensation = "";
    filtro_investment_compensation = "";
    filtro_operation_compensation = "";
    filtro_specific_compensation = "";
    searchData();
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

  th.search, td.search {
    border: transparent;
  }

  td#search_buttons {
    width: 20%;
  }

  div#advanced-search {
    display: grid;
    place-items: center;
    justify-self: center;
    width: 85%;
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
      <i class="bi bi-x-circle-fill text-danger"></i> DATO YA EXISTENTE.
  {:else if resultStatus === 404}
      <i class="bi bi-x-circle-fill text-danger"></i> NO EXISTE UN DATO CON ESAS PROPIEDADES.

  {/if}
</div>

<Table>
  <thead>
    <tr>

      <th class="search">
        <td class="search">
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
      <td class="search">
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
      <td class="search">
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
      <td class="search">
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
      <td id="search_buttons" class="search">
        <Button outline color="primary" on:click={searchData}> <Icon name="search" /> Buscar</Button>
        <Button outline color="secondary" on:click={clearSearch}><Icon name="x-circle" /> Limpiar</Button>
        {#if !advancedSearch}
          <Button outline color="success" on:click={() => advancedSearch = true}><Icon name="eyeglasses" /> Búsqueda Avanzada </Button>
        {:else}
          <Button outline color="success" on:click={() => { advancedSearch = false; clearAdvancedSearch();}}><Icon name="x-lg" /> Cerrar </Button>
        {/if}
      </td>
    </tr>
  </thead>
</Table>

{#if advancedSearch}
  <div id="advanced-search">
    <Table>
      <thead>
        <tr>
          <td class="search">         
            <Input bind:value={filtro_subsidized_energy} placeholder="Energía Subvencionada" class="form-control" />
          </td>
          <td class="search">
            <Input bind:value={filtro_total_compensation} placeholder="Compensación total" class="form-control" />
          </td>
          <td class="search">
            <Input bind:value={filtro_investment_compensation} placeholder="Compensación por inversión" class="form-control" />
          </td>
          <td class="search">
            <Input bind:value={filtro_operation_compensation} placeholder="Compensación por operación" class="form-control" />
          </td>
          <td class="search">
            <Input bind:value={filtro_specific_compensation} placeholder="Compensación específica" class="form-control" />
          </td>
        </tr>
      </thead>
    </Table>
  </div>
{/if}

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
          <td><Input bind:value={newRetributionYear} /> </td>
          <td><Input bind:value={newRetributionTechnology} /> </td>
          <td><Input bind:value={newRetributionSubsidizedEnergy} /> </td>
          <td><Input bind:value={newRetributionTotalCompensation} /> </td>
          <td><Input bind:value={newRetributionInvestmentCompensation} /> </td>
          <td><Input bind:value={newRetributionOperationCompensation} /> </td>
          <td><Input bind:value={newRetributionSpecificCompensation} /> </td>
          <td><Input bind:value={newRetributionAACC} /> </td>
          <td>
            <Button outline color="primary" on:click={createAnnualRetribution}><Icon name="plus-circle" />  Crear</Button>
            <Button outline color="secondary" on:click={clearCreation}><Icon name="x-circle" />  Limpiar</Button>
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
          <Button outline color="info" on:click={() => goto(`/annual-retributions/${retribution.technology}/${retribution.year}`)}><Icon name="pencil-square" />  Actualizar</Button>
          <Button outline color="danger" on:click={() => {deleteAnnualRetribution(retribution.year, retribution.technology)}}><Icon name="trash" />  Borrar</Button>
          </td>
        </tr>
      {/each}
  </Table>

</div>
<div align="right" style="padding: 1.5%;">
<Button color=danger on:click={deleteAnnualRetributions}> <Icon name="trash3-fill" /> Borrar todo  <Icon name="exclamation-triangle-fill" /></Button>
</div>