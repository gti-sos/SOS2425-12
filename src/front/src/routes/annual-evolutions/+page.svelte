  <script>
  // @ts-nocheck
      import { dev } from "$app/environment";
      import { goto } from "$app/navigation";
      import 'bootstrap-icons/font/bootstrap-icons.css';
  

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
      let filtroYearFrom = "";
      let filtroYearTo = "";
      let filtroTech = "";

      let filtro_energy_sold = "";
      let filtro_installed_power = "";
      let filtro_load_factor = "";

      let advancedSearch = false;


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
      let queryParams = [];

      if (filtroAacc) queryParams.push(`aacc=${encodeURIComponent(filtroAacc)}`);
      if (filtroYearFrom) queryParams.push(`from=${encodeURIComponent(filtroYearFrom)}`);
      if (filtroYearTo) queryParams.push(`to=${encodeURIComponent(filtroYearTo)}`);
      if (filtroTech) queryParams.push(`technology=${encodeURIComponent(filtroTech)}`);

      if (filtro_energy_sold) queryParams.push(`energy_sold=${encodeURIComponent(parseFloat(filtro_energy_sold))}`);
      if (filtro_installed_power) queryParams.push(`installed_power=${encodeURIComponent(parseFloat(filtro_installed_power))}`);
      if (filtro_load_factor) queryParams.push(`load_factor=${encodeURIComponent(parseFloat(filtro_load_factor))}`);

      let finalUrl = API;
      if (queryParams.length) finalUrl += "?" + queryParams.join("&");

      try {
          const res = await fetch(finalUrl, { method: "GET" });

          if (res.status === 200) {
              const datos = await res.json();
              evolution_data = datos;
              resultStatus = 200;

              if (evolution_data.length === 0) {
                  resultStatus = 404;
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

<Button color="dark" on:click={() => goto(`/graphs/evolucion-anual/`)}>
  Gráfica Evolución Anual </Button>
<Button color="dark" on:click={() => goto(`/graphs/factor-carga-aacc/`)}>
  Gráficas Factor de Carga Medio
</Button>

<div class="text-center mb-2">
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
  {/if}
</div>

<Table>
  <thead>
    <tr>
      <th>Comunidad Autónoma</th>
      <th>Año Inicio</th>
      <th>Año Fin</th>
      <th>Tecnología</th>
      <th>Acciones</th>
      <th>Búsqueda Avanzada</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <select bind:value={filtroAacc} class="form-select">
          <option value="" disabled selected>Comunidad autónoma</option>
          <option value="Andalucía">Andalucía</option>
          <option value="Aragón">Aragón</option>
          <option value="Asturias">Asturias</option>
          <option value="Baleares">Baleares</option>
          <option value="Canarias">Canarias</option>
          <option value="Cantabria">Cantabria</option>
          <option value="Castilla La Mancha">Castilla La Mancha</option>
          <option value="Castilla y León">Castilla y León</option>
          <option value="Cataluña">Cataluña</option>
          <option value="Ceuta y Melilla">Ceuta y Melilla</option>
          <option value="Comunidad Valenciana">Comunidad Valenciana</option>
          <option value="Extremadura">Extremadura</option>
          <option value="Galicia">Galicia</option>
          <option value="Madrid">Madrid</option>
          <option value="Murcia">Murcia</option>
          <option value="Navarra">Navarra</option>
          <option value="País Vasco">País Vasco</option>
          <option value="La Rioja">La Rioja</option>
        </select>
        
      </td>

      <td>
        <select bind:value={filtroYearFrom} class="form-select">
          <option value="" disabled selected>Año (inicio)</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
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
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
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
        <select bind:value={filtroTech} class="form-select">
          <option value="" disabled selected>Tecnología</option>
          <option value="Biomasa">Biomasa</option>
          <option value="Residuos">Residuos</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Cogeneración">Cogeneración</option>
          <option value="Eólica">Eólica</option>
          <option value="Solar FV">Solar FV</option>
          <option value="Solar TE">Solar TE</option>
          <option value="Trat.residuos">Trat.residuos</option>
          <option value="Otras tecn. renovables">Otras tecn. renovables</option>

        </select>
      </td>

      <td>
        <Button color="primary" on:click={searchData}>
          <i class="bi bi-search"></i> Buscar
        </Button>
        <Button color="secondary" on:click={() => { filtroAacc = filtroYearFrom = filtroYearTo = filtroTech = resultStatus = ""; getData(); }}>
          <i class="bi bi-arrow-clockwise"></i> Limpiar
        </Button>
      </td>

      <td>
        {#if !advancedSearch}
          <Button outline color="success" on:click={() => advancedSearch = true}>
            <i class="bi bi-eyeglasses"></i> Búsqueda Avanzada
          </Button>
        {:else}
          <Button outline color="success" on:click={() => { advancedSearch = false; filtro_energy_sold = filtro_installed_power = filtro_load_factor = ""; }}>
            <i class="bi bi-x-lg"></i> Cerrar
          </Button>
        {/if}
      </td>
    </tr>
  </tbody>
</Table>

  {#if advancedSearch}
  <div id="advanced-search" style="margin-top: 10px;">
    <Table>
      <thead>
        <tr>
          <th><input bind:value={filtro_energy_sold} placeholder="Energía Vendida" class="form-control" /></th>
          <th><input bind:value={filtro_installed_power} placeholder="Potencia Instalada" class="form-control" /></th>
          <th><input bind:value={filtro_load_factor} placeholder="Factor de Carga" class="form-control" /></th>
        </tr>
      </thead>
    </Table>
  </div>
{/if}


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
        <input bind:value={new_evolution_installed_power} placeholder="Ej: 100"  />
      </td>
      <td>
        <input bind:value={new_evolution_load_factor} placeholder="Ej: 40" />
      </td>
      <td>
        <Button color="success" on:click={createData}>Crear</Button>
        <Button color="secondary" on:click={() => {
          new_evolution_energy_sold = new_evolution_load_factor = new_evolution_installed_power = new_evolution_aacc 
          = new_evolution_year = new_evolution_technology = resultStatus = ""; createData; }}><i class="bi bi-arrow-clockwise"></i> Limpiar</Button>

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
          <Button color="danger" on:click={() => deleteData(data.aacc, data.year, data.technology)}> <i class="bi bi-trash3-fill"></i> Borrar</Button>
          <Button color="warning" on:click={() => goto(`/annual-evolutions/${data.aacc}/${data.year}/${data.technology}`)}>
            <i class="bi bi-pencil-fill"></i>  Editar
          </Button>
        </td>
      </tr>
    {/each}

    <tr>
      <td colspan="7">
        <Button color="danger" on:click={deleteAll}> <i class="bi bi-trash3-fill"></i> Borrar todo</Button>
      </td>
    </tr>
  </tbody>
</Table>
