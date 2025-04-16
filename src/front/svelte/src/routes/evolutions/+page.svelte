<script>

    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/annual_evolutions";

    if(dev){
        API = DEVEL_HOST + API;
    }

    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';


    let evolution_data = {};
    let result = ""; // resultado que devuelve la API
    let resultStatus = "";  // codigo de estado
    let new_evolution_aacc;
    let new_evolution_year;
    let new_evolution_technology;
    let new_evolution_installed_power;
    let new_evolution_energy_sold;
    let new_evolution_load_factor;

    //GET
    async function getData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});
            const data = await res.json(); 
            result = JSON.stringify(data,null,2); 

            evolution_data = data;
            console.log(`Response received:\n${JSON.stringify(evolution_data,null,2)}`);
        } catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
        
    }



    // SEARCH
    async function searchData() {
        resultStatus = result = ""; // Reseteamos el resultado

        const from = ""; 
        const to = "";   

        try {
            const res = await fetch(`${API}?from=${from}&to=${to}`, { method: "GET" });
            const data = await res.json();  // Obtener la respuesta de la API

            result = JSON.stringify(data, null, 2);  // Mostrar los datos

            evolution_data = data;  // Almacenamos los datos obtenidos

            console.log(`Search Response received:\n${JSON.stringify(evolution_data, null, 2)}`);
        } catch (error) {
            console.log(`ERROR searching data from ${API}: ${error}`);
        }
    }


</script>





<h2>Datos sobre la evolución anual en {evolution_data.aacc} para el año {evolution_data.year} y la tecnología {evolution_data.technology}</h2>
<!--{JSON.stringify(evolution_data,null,2)}-->

<Table>
    <thead>
        <tr>
            <th>AACC</th>
            <th>Year</th>
            <th>Technology</th>
            <th>Energy Sold</th>
            <th>Installed Power</th>
            <th>Load Factor</th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={evolution_data.aacc}>
            </td>
            <td>
                <input bind:value={evolution_data.year}>
            </td>
            <td>
                <input bind:value={evolution_data.technology}>
            </td>
            <td>
                <input bind:value={evolution_data.energy_sold}>
            </td>
            <td>
                <input bind:value={evolution_data.installed_power}>
            </td>
            <td>
                <input bind:value={evolution_data.load_factor}>
            </td>
    
        </tr>
        
    </tbody>
</Table>

