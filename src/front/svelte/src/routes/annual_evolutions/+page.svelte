<script>
// @ts-nocheck
    import { dev } from "$app/environment"; 

    let DEVEL_HOST = "http://localhost:16078";

    let API = "/api/v1/annual_evolutions";

    if(dev)
        API = DEVEL_HOST + API;

    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let evolution_data = [];
    let result = "";
    let resultStatus = "";
    let new_evolution_aacc;
    let new_evolution_year;
    let new_evolution_technology;  
    let new_evolution_installed_power;  
    let new_evolution_energy_sold;  
    let new_evolution_load_factor;  
    

//GET (Listar todos los recursos)
    async function getData(){
        resultStatus = result = "";
        try {
            const res = await fetch(API,{method:"GET"});
  
            const data = await res.json();
            result = JSON.stringify(data,null,2);

            evolution_data = data;
            console.log(`Response received:\n${JSON.stringify(evolution_data,null,2)}`);

        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }


//PUT (Editar recurso)
    async function editData() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    aacc : evolution_data.aacc,
                    year : evolution_data.year,
                    tech : evolution_data.tech,
                    energy : new_evolution_energy_sold,
                    power : new_evolution_installed_power,
                    load_factor : new_evolution_load_factor,
                })
            });
            const status = await res.status; 
            resultStatus = status;
            if(status === 200){
                console.log(`Data updated`);
                getData();
            }else{
                console.log(`Error editing data: status received\n${status}`);
            }
            //result = JSON.stringify(data,null,2);

        } catch(error){
            console.log(`ERROR editing data from ${API}: ${error}`);
        }
        
    }




//DELETE (Borrar todos los recursos)
async function deleteAll(){
        resultStatus = result = "";
        try {
            const res = await fetch(API,{method:"DELETE"});
  
            const status = await res.status;
            resultStatus = status;

            if(status == 200){
                console.log(`deleted`);
                getData();
            } else {
                console.log(`ERROR deleting all: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }


//DELETE (Borrar un recurso concreto)
    async function deleteData(aacc){
        resultStatus = result = "";
        try {
            const res = await fetch(API+"/"+aacc,{method:"DELETE"});
  
            const status = await res.status;
            resultStatus = status;

            if(status == 200){
                console.log(`data ${aacc} deleted`);
                getData();
            } else {
                console.log(`ERROR deleting data ${aacc}: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }

//POST (Crear un recurso)
    async function createData(){
        resultStatus = result = "";
        try {
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({ 
                    aacc: new_evolution_aacc,
                    year: new_evolution_year,
                    tech: new_evolution_technology,
                    energy: new_evolution_energy_sold,
                    power: new_evolution_installed_power,
                    load_factor: new_evolution_load_factor

                })
            });
  
            const status = await res.status;
            resultStatus = status;
            if(status == 201){
                console.log(`data created`);
                getData();
            } else {
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





<h2>Annual Evolution</h2>

  <Table>
    <thead>
        <tr>
            <th>Aacc</th>
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
                <input bind:value={new_evolution_aacc}>
            </td>
            <td>
                <input bind:value={new_evolution_year}>
            </td>
            <td>
                <input bind:value={new_evolution_technology}>
            </td>
            <td>
                <input bind:value={new_evolution_energy_sold}>
            </td>
            <td>
                <input bind:value={new_evolution_installed_power}>
            </td>
            <td>
                <input bind:value={new_evolution_load_factor}>
            </td>
            <td>
                <Button color="primary" on:click={createData}>Create</Button>
            </td>
        </tr>
        {#each evolution_data as data}
            <tr>
                <td>
                    {data.aacc}
                </td>
                <td>
                    {data.year}
                </td>
                <td>
                    <Button color="danger" on:click={() => {deleteData(data.aacc)}}>Delete</Button>
                </td>
                <td>
                    <Button color="primary" on:click={editData}>Actualizar</Button>
                </td>
            </tr>
            <tr>
                <td>
                    <Button color="danger" on:click={()=>{deleteData(evolution_data.aacc,evolution_data.year,evolution_data.tech)}}>Borrar</Button>
                </td>
            </tr>

        {/each}
    </tbody>
</Table>

