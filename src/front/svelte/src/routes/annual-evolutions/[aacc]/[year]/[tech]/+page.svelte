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
    
    
    
    
    
    <h2>Annual Evolution: {data.aacc}, {data.year}, {data.tech}</h2>
    
      <Table>
        <tbody>
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
                    <input bind:value={data.energy}>
                </td>
                <td>
                    <input bind:value={data.power}>
                </td>
                <td>
                    <input bind:value={data.load_factor}>
                </td>
                <td>
                    <Button color="primary" on:click={editData}>Update</Button>
                </td>
            </tr>
  
        </tbody>
    </Table>

 <Button color="warning" on:click={() => goto(`/annual_evolutions/`)}> Back </Button>                
    
    