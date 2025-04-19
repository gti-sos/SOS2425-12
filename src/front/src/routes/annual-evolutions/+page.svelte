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
      result = "";
      // resultStatus = null;
      try {

        const res = await fetch(API, { method: "GET" });
          const fetchedData = await res.json();
          result = JSON.stringify(fetchedData, null, 2);

          evolution_data = fetchedData;
          console.log(`Datos recibidos:\n${JSON.stringify(evolution_data, null, 2)}`);
      } catch (error){
          console.log(`ERROR: GET desde ${API}: ${error}`);
      }
  }


  //SEARCH
  async function searchData() {
      result = "";
      // resultStatus = null;
      let queryParams = [];

      if (filtroAacc) queryParams.push(`aacc=${encodeURIComponent(filtroAacc)}`);
      if (filtroYear) queryParams.push(`year=${encodeURIComponent(filtroYear)}`);
      if (filtroTech) queryParams.push(`technology=${encodeURIComponent(filtroTech)}`);

      let finalUrl = API;
      if (queryParams.length) finalUrl += "?" + queryParams.join("&");

      try {
          const res = await fetch(finalUrl, { method: "GET" });

          if (res.status === 200) {
              const datos = await res.json();
              evolution_data = datos;

              if (evolution_data.length === 0) {
                  alert("NO HAY DATOS PARA ESTOS FILTROS.");
                  // evolution_data = [];
              }
          } else {
              alert(`Error al realizar la búsqueda (código ${res.status})`);
          }
      } catch (error) {
          alert(`Error al conectar con el servidor: ${error}`);
      }
  }
  


  //DELETE (Borrar todos los recursos)
  async function deleteAll(){
          result = "";
          // resultStatus = null;
          try {
              const res = await fetch(API,{method:"DELETE"});
    
              const status = await res.status;
              resultStatus = status;

              if(status == 200){
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
          result = "";
          // resultStatus = null;
          try {
            const res = await fetch(
              `${API}/${encodeURIComponent(aacc)}/${year}/${encodeURIComponent(technology)}`,
              { method: "DELETE" });  
              const status = await res.status;
              resultStatus = status;

              if(status == 200){
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
          result = "";
          // resultStatus = null;
          try {
              const res = await fetch(API,{
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
    
              const status = await res.status;
              resultStatus = status;
              if(status == 201){
                getData();
                new_evolution_aacc = "";
                new_evolution_year = "";
                new_evolution_technology = "";
                new_evolution_energy_sold = "";
                new_evolution_installed_power = "";
                new_evolution_load_factor = "";
              }
              else {
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
 
      {#if resultStatus === 201}
          <i class="bi bi-check-circle-fill text-success"></i> DATO CREADO CORRECTAMENTE.
      {:else if resultStatus === 200}
          <i class="bi bi-check-circle-fill text-success"></i> OPERACIÓN COMPLETADA CORRECTAMENTE.
      {:else if resultStatus === 400}
          <i class="bi bi-exclamation-triangle-fill text-warning"></i> FALTAN DATOS REQUERIDOS.
      {:else if resultStatus === 409}
          <i class="bi bi-x-circle-fill text-danger"></i> YA EXISTE ESTE DATO.
      {:else if resultStatus === 404}
          <i class="bi bi-x-circle-fill text-danger"></i> DATO NO ENCONTRADO.
      {:else}
          <i class="bi bi-x-circle-fill text-danger"></i>
      {/if}

  <Table>
  
    <thead>
      <tr>

        <th style="margin-bottom: 1rem;">
          <td>
          <select bind:value={new_evolution_aacc} class="form-select">
            <option value="" disabled selected>Comunidad autónoma</option>
            <option value="Andalucía">Andalucía</option>
            <option value="Aragón">Aragón</option>
            <option value="Asturias, Principado de">Asturias, Principado de</option>
            <option value="Balears, Illes">Balears, Illes</option>
            <option value="Canarias">Canarias</option>
            <option value="CantabriaV">Cantabria</option>
            <option value="Castilla - La Mancha">Castilla - La Mancha</option>
            <option value="Castilla y León">Castilla y León</option>
            <option value="Cataluña">Cataluña</option>
            <option value="Ceuta">Ceuta</option>
            <option value="Comunitat Valenciana">Comunitat Valenciana</option>
            <option value="Extremadura">Extremadura</option>
            <option value="Galicia">Galicia</option>
            <option value="Madrid, Comunidad de">Madrid, Comunidad de</option>
            <option value="Navarra, Comunidad Foral de">Navarra, Comunidad Foral de</option>
            <option value="País Vasco">País Vasco</option>
          </select>         
        </td>
        <td>
            <select bind:value={new_evolution_year} class="form-select">
            <option value="" disabled selected>Año</option>
            <option value="2005">2005</option>
            <option value="2005">2006</option>
            <option value="2005">2007</option>
            <option value="2005">2008</option>
            <option value="2005">2009</option>
            <option value="2005">2010</option>
            <option value="2005">2011</option>
            <option value="2005">2012</option>
            <option value="2005">2013</option>
            <option value="2005">2014</option>
            <option value="2005">2015</option>
            <option value="2005">2016</option>
            <option value="2005">2017</option>
            <option value="2005">2018</option>
            <option value="2005">2019</option>
            <option value="2005">2020</option>
            <option value="2005">2021</option>
            <option value="2005">2022</option>
            <option value="2005">2023</option>
            <option value="2005">2024</option>
          </select>          
        </td>
        <td>
          <select bind:value={new_evolution_technology} class="form-select">
            <option value="" disabled selected>Tecnología</option>
            <option value="Biomasa">Biomasa</option>
            <option value="Residuos">Residuos</option>
            <option value="Hidráulica">Hidráulica</option>
            <option value="Cogeneración">Cogeneración    </option>
            <option value="Eólica">Eólica</option>
            <option value="Solar FV">Solar FV</option>
            <option value="Trat.residuos">Trat.residuos</option>
          </select>        
        </td>
          <Button color="info" on:click={searchData()}>Buscar</Button>
          <Button color="secondary" on:click={() => { filtroAacc = filtroYear = filtroTech = ""; getData(); }}>Limpiar</Button>
      </tr>
        
    </thead>

  </Table>

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
          <Button color="secondary" on:click={() => {
            new_evolution_energy_sold = new_evolution_load_factor = new_evolution_installed_power = new_evolution_aacc 
            = new_evolution_year = new_evolution_technology = ""; createData; }}>Limpiar</Button>

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
  
