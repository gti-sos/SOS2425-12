<svelte:head>
  <link 
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" />  <!-- Estilos de C3 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>   <!-- D3 (requisito de C3) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>   <!-- C3.js -->

</svelte:head>

<script>
  // @ts-nocheck
  import { onMount } from "svelte";

    let data1 = [];
    let data2 = [];
    let aaccs = [];
    let fatal_accidents = [];
    let deceased = [];
    let vehicles_without_mot = [];
    let years = [];
    let energy_sold = [];
    let installed_power = [];


    let totalAccidentes = [];
    let totalFallecidos = [];
    let totalSinITV = [];
    let totalEnergia = [];
    let totalPotencia = [];

      async function loadData() {
        try{
          const { default: c3 } = await import('c3');
          const res1 = await fetch('https://sos2425-20.onrender.com/api/v1/traffic-accidents');
          // const res2 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
          const res2 = await fetch('http://localhost:16078/api/v1/annual-evolutions');
          data1 = await res1.json();
          data2 = await res2.json();
          if (data1.length === 0){
            const res1 = await fetch('https://sos2425-20.onrender.com/api/v1/traffic-accidents/loadInitialData');
            data1 = await res1.json();
          }

          // Extraer años únicos de ambas APIs
          const years1 = [...new Set(data1.map(d => d.year))];
          const years2 = [...new Set(data2.map(d => d.year))];
          const commonYears = years1.filter(year => years2.includes(year)); // Encontrar los años en común
          console.log("Años en común:", commonYears);


          const grouped = {};
          data1.filter(d => commonYears.includes(d.year)).forEach(d => {
            const ccaa = d.autonomous_community;
            if (!grouped[ccaa]) grouped[ccaa] = { fatal_accidents: 0, deceased: 0, vehicles_without_mot: 0, energy_sold: 0, installed_power: 0 };
            grouped[ccaa].fatal_accidents += d.fatal_accidents;
            grouped[ccaa].deceased += d.deceased;
            grouped[ccaa].vehicles_without_mot += d.vehicles_without_mot;
          });

          data2.filter(d => commonYears.includes(d.year)).forEach(d => {
            const ccaa = d.aacc;
            console.log(ccaa);
            if (!grouped[ccaa]) grouped[ccaa] = { fatal_accidents: 0, deceased: 0, vehicles_without_mot: 0, energy_sold: 0, installed_power: 0 };
            grouped[ccaa].energy_sold += d.energy_sold;
            grouped[ccaa].installed_power += d.installed_power;
          });

          // 4) Extraigo las arrays finales
          aaccs = Object.keys(grouped).sort();
          totalAccidentes = aaccs.map(ccaa => grouped[ccaa]?.fatal_accidents || 0);
          totalFallecidos = aaccs.map(ccaa => grouped[ccaa]?.deceased || 0);
          totalSinITV     = aaccs.map(ccaa => grouped[ccaa]?.vehicles_without_mot || 0);
          totalEnergia    = aaccs.map(ccaa => grouped[ccaa]?.energy_sold || 0);
          totalPotencia  = aaccs.map(ccaa => grouped[ccaa]?.installed_power || 0);

          drawChart();

        }catch (err) {
      console.error('Error cargando /traffic-accidents:', err);
      }
    };

      function drawChart(){

        c3.generate({
          bindto: '#trafficChart',
          data: {
            x: 'x',
            columns: [
              ['x', ...aaccs],
              ['Accidentes mortales', ...totalAccidentes],
              ['Fallecidos', ...totalFallecidos],
              ['Vehículos sin ITV', ...totalSinITV],
              ['Energía Vendida', ...totalEnergia],
              ['Potencia instalada', ...totalPotencia],
            ],
            type: 'bar',
            colors: {
              'Accidentes mortales': '#f3f568',  
              'Fallecidos': '#9db4ec', 
              'Vehículos sin ITV': '#74e4a4',  
              'Energía Vendida': '#f6616b' ,
              'Potencia instalada': '#f9a1f5'  
            }
          },

          axis: {
            x: {
              type: 'category',
              label: { text: 'Comunidad Autónoma', position: 'outer-middle' }
            },
            y: {
          label: { text: 'Cantidad', position: 'outer-middle' }
        }
      },
      bar: {
        width: { ratio: 0.6 }
      }
    });
  }

  // Disparamos la carga al montar
  onMount(loadData);
</script>

<section>
  <h2>Accidentes de Tráfico y Evolución Energia Renovable</h2>
  <div id="trafficChart"></div>
</section>


<style>
  #trafficChart {
    width: 100%;
    height: 400px;   
    margin: 1rem 0;
  }
</style>