<script>
// @ts-nocheck
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
    let query = [];

    if (filtroAacc) {
      query.push(`aacc=${encodeURIComponent(filtroAacc)}`);
    }
    if (filtroYear) {
      query.push(`year=${encodeURIComponent(filtroYear)}`);
    }
    if (filtroYearFrom) {
      query.push(`from=${encodeURIComponent(filtroYearFrom)}`);
    }
    if (filtroYearTo) {
      query.push(`to=${encodeURIComponent(filtroYearTo)}`);
    }
    let Url = API;
    if (query.length > 0) {
      Url += "?" + query.join("&");
    }
    try {
      const res = await fetch(Url, { method: "GET" });
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      annual_consumptions = data;
      console.log(`Response received`, annual_consumptions);
    } catch (error) {
      console.log(`ERROR: GET from ${Url}: ${error}`);
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
    background-color: #6c757d; /* Gray */
    color: white;
    border: 1px solid #343a40; /* Darker gray for margins */
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  button.extra:hover {
    background-color: #343a40; /* Darker gray on hover */
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
</style>

<h2 style="padding: 1.5%;">Consumo Anual</h2>
<div id="body">
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
  <Table>
    <thead>
      <tr>
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
          <Button outline color="primary" on:click={searchConsumption}>Buscar</Button>
          <Button outline color="secondary" on:click={clearFilters}>Limpiar</Button>
        </td>
      </tr>
    </thead>
  </Table>
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
        <th>Acciones</th>
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
        <td>
          <button class="primary" on:click={createAnnualConsumption}>Crear</button>
          <button class="extra" on:click={clearInputs}>Limpiar</button>
        </td>
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
            <button class="info" on:click={() => goto(`/annual-consumptions/${consumption.aacc}/${consumption.year}`)}>
              Actualizar
            </button>
            <button class="danger" on:click={() => deleteAnnualConsumption(consumption.aacc, consumption.year)}>
              Borrar
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
  <button class="danger" on:click={deleteAllAnnualConsumptions} style="margin-bottom: 1rem;">
    Borrar todo
  </button>
</div>