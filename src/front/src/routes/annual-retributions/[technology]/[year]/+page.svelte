<script>
    // @ts-nocheck
    import { dev } from "$app/environment"; 
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/annual-retributions/" + $page.params.technology + "/" + $page.params.year;
    if(dev) API = DEVEL_HOST + API;

    let retribution_data = {};
    let result = "";
    let resultStatus = "";

    async function getRetribution(){
        result = "";
        try {
            const res = await fetch(API,{method:"GET"});
            const loaded = await res.json();
            result = JSON.stringify(loaded, null, 2);
            console.log(`Datos recibidos:\n${loaded}`);
            retribution_data = loaded;
            console.log(`Datos recibidos:\n${JSON.stringify(retribution_data, null, 2)}`);
        } catch (error){
            console.log(`ERROR al obtener datos desde ${API}: ${error}`);
        }
    }

    async function editRetribution() {
        result = "";
        try {
            const res = await fetch(API, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    year:retribution_data.year,
                    technology:retribution_data.technology,
                    subsidized_energy:retribution_data.subsidized_energy,
                    total_compensation:retribution_data.total_compensation,
                    investment_compensation:retribution_data.investment_compensation,
                    operation_compensation:retribution_data.operation_compensation,
                    specific_compensation:retribution_data.specific_compensation,
                    aacc:retribution_data.aacc,
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(resultStatus === 200){
                console.log(`Datos actualizados`);
                getRetribution();
            }
            else{
                console.log(`Error actualizando: status ${status}`);
            }
        } catch(error){
            console.log(`ERROR al actualizar: ${error}`);
        }
    }



    onMount(async () => {
        getRetribution();
    })
</script>

<head>
    <title>Editor de retribución</title>
</head>

<h2>Retribución Anual: {retribution_data.technology}, {retribution_data.year}</h2>

<div class="text-center mb-2">
    {#if resultStatus === 200}
            OPERACIÓN COMPLETADA CORRECTAMENTE.
        {:else if resultStatus === 400}
            FALTAN DATOS REQUERIDOS.
    {/if}
</div>

<Table>
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
            <td>{retribution_data.year}</td>
            <td>{retribution_data.technology}</td>
            <td><input type="text" bind:value={retribution_data.subsidized_energy}></td>
            <td><input type="text" bind:value={retribution_data.total_compensation}></td>
            <td><input type="text" bind:value={retribution_data.investment_compensation}></td>
            <td><input type="text" bind:value={retribution_data.operation_compensation}></td>
            <td><input type="text" bind:value={retribution_data.specific_compensation}></td>
            <td><input type="text" bind:value={retribution_data.aacc}></td>
            <td><Button color="success" on:click={editRetribution}>Actualizar</Button></td>
        </tr>
    </tbody>
</Table>

<Button color="secondary" on:click={() => goto(`/annual-retributions/`)}>Atrás</Button>