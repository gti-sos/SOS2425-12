<script>
// @ts-nocheck
    import { dev } from "$app/environment"; 

    let DEVEL_HOST = "http://localhost:16078";

    let API = "/api/v1/annual-evolutions";

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



//load initial data
async function loadInitialData() {
  resultStatus = result = "";
  try {
    const res = await fetch(`${API}/loadInitialData`, {
      method: "GET"
    });

    const status = res.status;
    resultStatus = status;

    if (status === 201 || status === 200) {
      console.log("Initial data loaded");
      await getData(); // Recarga la tabla
    } else if (status === 400) {
      //const msg = await res.json();
      alert(msg.message); // Ya estaban cargados
    } else {
      console.error(`Unexpected status: ${status}`);
    }

  } catch (err) {
    console.error("Error loading initial data:", err);
  }
}
    

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



//DELETE (Borrar todos los recursos)
async function deleteAll(){
        resultStatus = result = "";
        try {
            const res = await fetch(API,{method:"DELETE"});
  
            const status = await res.status;
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
    async function deleteData(aacc, year, tech){
        resultStatus = result = "";
        try {
            const res = await fetch(API+"/"+aacc+"/"+year+"/"+tech,{method:"DELETE"});
  
            const status = await res.status;
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
                    {data.tech}
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
            </tr>
            <tr>
                <td>
                    <Button color="danger" on:click={()=>{deleteData(data.aacc, data.year, data.tech)}}>Delete</Button>
                <Button color="warning" on:click={() => goto(`/annual-evolutions/${data.aacc}/${data.year}/${data.tech}/edit`)}>
                    Edit
                    </Button>
                </td>
            </tr>

        {/each}

        <tr>
            <td>
                <Button color="danger" on:click={deleteAll}>Delete All</Button>
                <Button color="success" on:click={loadInitialData}>Load Initial Data</Button>
            </td>
        </tr>
    </tbody>
</Table>

