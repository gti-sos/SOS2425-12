<script>
    // @ts-nocheck
    import { dev } from "$app/environment"; 
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/annual-evolutions/" + $page.params.aacc + "/" + $page.params.year + "/" + $page.params.technology;
    if(dev) API = DEVEL_HOST + API;

    let evolution_data = {}; 
    let result = "";
    let resultStatus = "";

    async function getData(){
        result = "";
        try {
            const res = await fetch(API,{method:"GET"});
            const loaded = await res.json();
            result = JSON.stringify(loaded, null, 2);
            evolution_data = loaded[0];
            console.log(`Datos recibidos:\n${JSON.stringify(evolution_data, null, 2)}`);
        } catch (error){
            console.log(`ERROR al obtener datos desde ${API}: ${error}`);
        }
    }

    async function editData() {
        result = "";
        try {
            const res = await fetch(API, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    aacc : evolution_data.aacc,
                    year : evolution_data.year,
                    technology : evolution_data.technology,
                    energy_sold : evolution_data.energy_sold,
                    installed_power : evolution_data.installed_power,
                    load_factor : evolution_data.load_factor,
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(resultStatus === 200){
                console.log(`Datos actualizados`);
                getData();
            }
            else{
                console.log(`Error actualizando: status ${status}`);
            }
        } catch(error){
            console.log(`ERROR al actualizar: ${error}`);
        }
    }



    onMount(async () => {
        getData();
    })
</script>


<h2>Evolución Anual: {evolution_data.aacc}, {evolution_data.year}, {evolution_data.technology}</h2>

<div class="text-center mb-2">
    {#if resultStatus === 200}
            <i class="bi bi-check-circle-fill text-success"></i> OPERACIÓN COMPLETADA CORRECTAMENTE.
        {:else if resultStatus === 400}
            <i class="bi bi-exclamation-triangle-fill text-warning"></i> FALTAN DATOS REQUERIDOS.
    {/if}
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
        <td>{evolution_data.aacc}</td>
        <td>{evolution_data.year}</td>
        <td>{evolution_data.technology}</td>
        <td><input bind:value={evolution_data.energy_sold} /></td>
        <td><input bind:value={evolution_data.installed_power} /></td>
        <td><input bind:value={evolution_data.load_factor} /></td>
        <td><Button color="success" on:click={editData}>Actualizar</Button></td>
    </tr>
  </tbody>
</Table>

<Button color="secondary" on:click={() => goto(`/annual-evolutions/`)}>Atrás</Button>
