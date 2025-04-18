<script>
    // @ts-nocheck
    import { dev } from "$app/environment"; 
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/annual_evolutions/" + $page.params.aacc + "/" + $page.params.year + "/" + $page.params.technology;
    if(dev) API = DEVEL_HOST + API;

    let evolution_data = [];
    let result = "";
    let resultStatus = "";
    let new_evolution_aacc;
    let new_evolution_year;
    let new_evolution_technology;  
    let new_evolution_installed_power;  
    let new_evolution_energy_sold;  
    let new_evolution_load_factor;  

    async function getData(){
        resultStatus = result = "";
        try {
            const response = await fetch(API,{method:"GET"});
            const loaded = await response.json();
            result = JSON.stringify(data, null, 2);
            // data = fetched[0]; // Esperamos solo un resultado
            evolution_data = loaded;
            console.log(`Datos recibidos:\n${JSON.stringify(evolution_data, null, 2)}`);
        } catch (error){
            console.log(`ERROR al obtener datos desde ${API}: ${error}`);
        }
    }

    async function editData() {
        resultStatus = result = "";
        try {
            const response = await fetch(API, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    aacc : evolution_data.aacc,
                    year : evolution_data.year,
                    technology : evolution_data.technology,
                    energy_sold : new_evolution_energy_sold,
                    installed_power : new_installed_power,
                    load_factor : new_load_factor,
                })
            });
            const status = await response.status; 
            resultStatus = status;
            if(status === 200){
                console.log(`Datos actualizados`);
                getData();
            }else{
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

<Table>
  <tbody>
    <tr>
        <td>{evolution_data.aacc}</td>
        <td>{evolution_data.year}</td>
        <td>{evolution_data.technology}</td>
        <td><input bind:value={evolution_data.energy_sold} /></td>
        <td><input bind:value={evolution_data.installed_power} /></td>
        <td><input bind:value={evolution_data.load_factor} /></td>
        <Button color="primary" on:click={editData}>Actualizar</Button>
    </tr>
  </tbody>
</Table>

<Button color="warning" on:click={() => goto(`/annual-evolutions/`)}>Atrás</Button>
