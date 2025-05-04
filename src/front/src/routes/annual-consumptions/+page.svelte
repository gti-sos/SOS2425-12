<head>
  <title>Consumos Anuales</title>
</head>

<script>
// @ts-nocheck
  const comunidadesAutonomas = [
    "País Vasco", "Andalucía", "Balears, Illes", "Ceuta", "Murcia, Región de", "Extremadura", "Melilla",
    "Comunitat Valenciana", "Madrid, Comunidad de", "Galicia", "Canarias", "Navarra, Comunidad Foral de",
    "Castilla y León", "Castilla - La Mancha", "Cantabria", "Asturias, Principado de", "Cataluña"
  ];

  const años = [2017, 2018, 2019, 2020, 2021, 2022];

  import { onMount } from "svelte";
  import { Button, Table } from "@sveltestrap/sveltestrap";
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";


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

  let filtroAacc = "";
  let filtroYearFrom = "";
  let filtroYearTo = "";
  let filtroElectricity = "";
  let filtroGas = "";
  let filtroOther = "";
  let filtroTotal = "";
  let filtroCO2 = "";

  
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
              await getAnnualConsumptions();
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
              resultStatus = 200;
          }
          else {
              console.error(`Error deleting Consumption; Status received: ${resultStatus}`);
          }
      } catch (error) {
          console.error(`ERROR: DELETE to ${API}: ${error}`);
    }
}

  async function deleteAllAnnualConsumptions() {
      result = resultStatus = "";
      try {
          const res = await fetch(API, {method: "DELETE"});
          const status = await res.status;
          resultStatus = status;
          if (resultStatus === 200) {
              console.log(`All consumptions deleted`);
              getAnnualConsumptions();
          }
          else {
              console.error(`Error deleting all consumptions; Status received: ${resultStatus}`);
          }
      } catch (error) {
          console.error(`ERROR: DELETE to ${API}: ${error}`);
      }
  }

  async function updateAnnualConsumption(aacc, year) {
      result = resultStatus = "";
      try {
          const res = await fetch(API+"/"+aacc+"/"+year, {
              method: "PUT",
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
          
          if (resultStatus === 200) {
              console.log(`Consumption updated`);
              getAnnualConsumptions();
          }
          else {
              console.error(`Error updating Consumption; Status received: ${resultStatus}`);
          }
      } catch (error) {
          console.error(`ERROR: PUT to ${API}: ${error}`);
      }
    
  }

  async function searchConsumption() {
      result = "";
      let queryParams = [];

      if (filtroAacc) queryParams.push(`aacc=${encodeURIComponent(filtroAacc)}`);
      if (filtroYearFrom) queryParams.push(`from=${encodeURIComponent(filtroYearFrom)}`);
      if (filtroYearTo) queryParams.push(`to=${encodeURIComponent(filtroYearTo)}`);
      if (filtroElectricity) queryParams.push(`electricity=${encodeURIComponent(filtroElectricity)}`);
      if (filtroGas) queryParams.push(`gas=${encodeURIComponent(filtroGas)}`);
      if (filtroOther) queryParams.push(`other=${encodeURIComponent(filtroOther)}`);
      if (filtroTotal) queryParams.push(`total_consumption=${encodeURIComponent(filtroTotal)}`);
      if (filtroCO2) queryParams.push(`co2_emission=${encodeURIComponent(filtroCO2)}`);


      let finalUrl = API;
      if (queryParams.length) finalUrl += "?" + queryParams.join("&");

      try {
        const res = await fetch(finalUrl, { method: "GET" });

        if (res.status === 200) {
          const data = await res.json();
          data.sort((a, b) => { return b.total_consumption - a.total_consumption });
          annual_consumptions = data;
          resultStatus = 200;
          if (annual_consumptions.length === 0) {
            resultStatus = 404;
            }
        } else {
            alert(`Error al realizar la búsqueda (código ${res.status})`);
        }
      } catch (error) {
          alert(`Error al conectar con el servidor: ${error}`);
      }
  }

  function clearInputs() {
      newConsumptionAACC = "";
      newConsumptionYear = "";
      newConsumptionElectricity = "";
      newConsumptionGas = "";
      newConsumptionOther = "";
      newConsumptionTotalConsumption = "";
      newConsumptionCO2Emission = "";
      
  }

  function clearFilters() {
    filtroAacc = "";
    filtroYearFrom = "";
    filtroYearTo = "";
    filtroElectricity = "";
    filtroGas = "";
    filtroOther = "";
    filtroTotal = "";
    filtroCO2 = "";

    getAnnualConsumptions();
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
    padding: 0.5rem;
    text-align: center;
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

  button.extra {
    background-color: #6c757d;
    color: white;
    border: 1px solid #343a40;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button.extra:hover {
    background-color: #343a40;
    border-color: #343a40;
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

  button.pink {
      background-color: #ff69b4;
      color: white;
      border: 1px solid #c71585;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    button.pink:hover {
      background-color: #c71585;
      border-color: #c71585;
    }
</style>

<h2 style="padding: 1.5%;">Consumo Anual</h2>
<div id="body">
  <button class="pink" on:click={() => goto('/graphs/consumo-emisiones-anyo')}>Gráfica de consumo por año</button>
  <button class="pink" on:click={() => goto('/graphs/comparativa-comunidades')}>Gráfica de consumo por comunidad</button>

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
      <i class="bi bi-x-circle-fill text-danger"></i> NO EXISTE EL DATO.
    {/if}
  </div>

  <!-- Filtros superiores -->
  <table id="filter-table">
    <thead>
      <tr>
        <td>
          <select bind:value={filtroAacc} class="form-select">
            <option value="" disabled selected>Comunidad autónoma</option>
            {#each comunidadesAutonomas as ca}
              <option value={ca}>{ca}</option>
            {/each}
          </select>          
        </td>
        <td>
          <select bind:value={filtroYearFrom} class="form-select">
            <option value="" disabled selected>Año (inicio)</option>
            {#each años as año}
              <option value={año}>{año}</option>
            {/each}
          </select>          
        </td>
        <td>
          <select bind:value={filtroYearTo} class="form-select">
            <option value="" disabled selected>Año (fin)</option>
            {#each años as año}
              <option value={año}>{año}</option>
            {/each}
          </select>          
        </td>
        <td><input type="text" class="form-control" placeholder="Electricidad" bind:value={filtroElectricity}></td>
        <td><input type="text" class="form-control" placeholder="Gas" bind:value={filtroGas}></td>
        <td><input type="text" class="form-control" placeholder="Otros" bind:value={filtroOther}></td>
        <td><input type="text" class="form-control" placeholder="Consumo total" bind:value={filtroTotal}></td>
        <td><input type="text" class="form-control" placeholder="Emisión CO₂" bind:value={filtroCO2}></td>
        <td>
          <button class="primary" on:click={searchConsumption}>Buscar</button>
          <button class="extra" on:click={clearFilters}>Limpiar</button>
        </td>
      </tr>
    </thead>
  </table>

  <!-- Tabla principal de consumos -->
  <table id="consumption-table">
    <thead>
      <tr>
        <th>AACC</th>
        <th>Year</th>
        <th>Electricity</th>
        <th>Gas</th>
        <th>Other</th>
        <th>Total Consumption</th>
        <th>CO2 Emission</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <!-- Inputs para agregar nuevo dato -->
      <tr>
        <td><input bind:value={newConsumptionAACC}></td>
        <td><input bind:value={newConsumptionYear}></td>
        <td><input bind:value={newConsumptionElectricity}></td>
        <td><input bind:value={newConsumptionGas}></td>
        <td><input bind:value={newConsumptionOther}></td>
        <td><input bind:value={newConsumptionTotalConsumption}></td>
        <td><input bind:value={newConsumptionCO2Emission}></td>
        <td>
          <button class="primary" on:click={createAnnualConsumption}>Crear</button>
          <button class="extra" on:click={clearInputs}>Limpiar</button>
        </td>
      </tr>

      <!-- Datos existentes -->
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
            <button class="info" on:click={() => goto(`/annual-consumptions/${consumption.aacc}/${consumption.year}`)}>Actualizar</button>
            <button class="danger" on:click={() => deleteAnnualConsumption(consumption.aacc, consumption.year)}>Borrar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <button class="danger" on:click={deleteAllAnnualConsumptions} style="margin-top: 1rem;">Borrar todo</button>
</div>
