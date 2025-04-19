<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    import { goto } from "$app/navigation";
 

    let DEVEL_HOST = "http://localhost:16078";

    let API = "/api/v1/annual-evolutions";

    if(dev)
        API = DEVEL_HOST + API;

    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let evolution_data =  [];
    let result = "";
    let resultStatus = "";
    let new_evolution_aacc;
    let new_evolution_year;
    let new_evolution_technology;  
    let new_evolution_installed_power;  
    let new_evolution_energy_sold;  
    let new_evolution_load_factor;  


    let filtroAacc = "";
    let filtroYear = "";
    let filtroTech = "";



    

//GET (Listar todos los recursos)
async function getData(){
    resultStatus = result = "";
    try {

      const response = await fetch(API, { method: "GET" });
        const fetchedData = await response.json();
        result = JSON.stringify(fetchedData, null, 2);

        evolution_data = fetchedData;
        console.log(`Datos recibidos:\n${JSON.stringify(evolution_data, null, 2)}`);
    } catch (error){
        console.log(`ERROR: GET desde ${API}: ${error}`);
    }
}


//SEARCH
async function searchData() {
    resultStatus = result = "";
    let queryParams = [];

    if (filtroAacc) queryParams.push(`aacc=${encodeURIComponent(filtroAacc)}`);
    if (filtroYear) queryParams.push(`year=${encodeURIComponent(filtroYear)}`);
    if (filtroTech) queryParams.push(`technology=${encodeURIComponent(filtroTech)}`);

    let finalUrl = API;
    if (queryParams.length) finalUrl += "?" + queryParams.join("&");

    try {
        const response = await fetch(finalUrl, { method: "GET" });

        if (response.status === 200) {
            const datos = await response.json();
            evolution_data = datos;

            if (evolution_data.length === 0) {
                alert("NO HAY DATOS PARA ESTOS FILTROS.");
            }
        } else {
            alert(`Error al realizar la búsqueda (código ${response.status})`);
        }
    } catch (error) {
        alert(`Error al conectar con el servidor: ${error}`);
    }
}
 


//DELETE (Borrar todos los recursos)
async function deleteAll(){
        resultStatus = result = "";
        try {
            const response = await fetch(API,{method:"DELETE"});
  
            const status = await response.status;
            resultStatus = status;

            if(status == 200){
              console.log(`All data has been deleted`);
              getData();
            } else {
                console.log(`ERROR deleting all data: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }


//DELETE (Borrar un recurso concreto)
    async function deleteData(aacc, year, technology){
        resultStatus = result = "";
        try {
          const response = await fetch(
            `${API}/${encodeURIComponent(aacc)}/${year}/${encodeURIComponent(technology)}`,
            { method: "DELETE" });  
            const status = await response.status;
            resultStatus = status;

            if(status == 200){
              console.log(`data deleted`);
              getData();
            } else {
                console.log(`ERROR deleting data: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }

//POST (Crear un recurso)
    async function createData(){
        resultStatus = result = "";
        try {
            const response = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({ 
                    aacc: new_evolution_aacc,
                    year: new_evolution_year,
                    technology: new_evolution_technology,
                    energy_sold: new_evolution_energy_sold,
                    installed_power: new_evolution_installed_power,
                    load_factor: new_evolution_load_factor

                })
            });
  
            const status = await response.status;
            resultStatus = status;
            if(status == 201){
              console.log(`Data created`);
              getData();
              alert(`DATO CREADO CORRECTAMENTE`);
            }
            else if(status == 409){
              alert("YA EXISTE ESTE DATO");
            }else if(status == 400){
              alert("FALTAN DATOS REQUERIDOS");
            }else {
                console.log(`ERROR creating data: status received\n${status}`);
            }

        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }



    onMount(async () => {
        getData();
    })

</script>





<h2>Evolución Anual</h2>

<div style="margin-bottom: 1rem;">
  <div>Filtrar:</div>
  <input bind:value={filtroAacc} placeholder="Comunidad" />
  <input bind:value={filtroYear} placeholder="Año" />
  <input bind:value={filtroTech} placeholder="Tecnología" />
  <Button color="info" on:click={searchData()}>Buscar</Button>
  <Button color="secondary" on:click={() => { filtroAacc = filtroYear = filtroTech = ""; getData(); }}>Limpiar</Button>
</div>

<Table>
 
  <thead>
    <tr>
      <th>Comunidad Autónoma</th>
      <th>Año</th>
      <th>Tecnología</th>
      <th>Energía Vendida</th>
      <th>Potencia Instalada</th>
      <th>Factor de Carga</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <input bind:value={new_evolution_aacc} placeholder="Ej: Ceuta" />
      </td>
      <td>
        <input bind:value={new_evolution_year} placeholder="Ej: 2000" />
      </td>
      <td>
        <input bind:value={new_evolution_technology} placeholder="Ej: Residuos" />
      </td>
      <td>
        <input bind:value={new_evolution_energy_sold} placeholder="Ej: 300" />
      </td>
      <td>
        <input bind:value={new_evolution_installed_power} placeholder="Ej: 100" />
      </td>
      <td>
        <input bind:value={new_evolution_load_factor} placeholder="Ej: 40" />
      </td>
      <td>
        <Button color="primary" on:click={createData}>Crear</Button>
      </td>
    </tr>

    {#each evolution_data as data}
      <tr>
        <td>{data.aacc}</td>
        <td>{data.year}</td>
        <td>{data.technology}</td>
        <td>{data.energy_sold}</td>
        <td>{data.installed_power}</td>
        <td>{data.load_factor}</td>
        <td>
          <Button color="danger" on:click={() => deleteData(data.aacc, data.year, data.technology)}>Borrar</Button>
          <Button color="warning" on:click={() => goto(`/annual-evolutions/${data.aacc}/${data.year}/${data.technology}`)}>
            Editar
          </Button>
        </td>
      </tr>
    {/each}

    <tr>
      <td colspan="7">
        <Button color="danger" on:click={deleteAll}>Borrar todo</Button>
      </td>
    </tr>
  </tbody>
</Table>
