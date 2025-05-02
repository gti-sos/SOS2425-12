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

    let data = [];
    let aaccs = [];
    let fatal_accidents = [];
    let deceased = [];
    let vehicles_without_mot = [];
    let years = [];

    let totalAccidentes = [];
    let totalFallecidos = [];
    let totalSinITV = [];

      async function loadData() {
        try{
          const { default: c3 } = await import('c3');
          const res = await fetch('https://sos2425-20.onrender.com/api/v1/traffic-accidents');
          data = await res.json();
          if (data.length === 0){
            const res = await fetch('https://sos2425-20.onrender.com/api/v1/traffic-accidents/loadInitialData');
            data = await res.json();
          }

          const grouped = {};
          data.forEach(d => {
            const ccaa = d.autonomous_community;
            if (!grouped[ccaa]) grouped[ccaa] = { fatal_accidents: 0, deceased: 0, vehicles_without_mot: 0 };
            grouped[ccaa].fatal_accidents += d.fatal_accidents;
            grouped[ccaa].deceased += d.deceased;
            grouped[ccaa].vehicles_without_mot     += d.vehicles_without_mot;
          });

          // 4) Extraigo las arrays finales
          aaccs = Object.keys(grouped).sort();
          totalAccidentes = aaccs.map(ccaa => grouped[ccaa].fatal_accidents);
          totalFallecidos = aaccs.map(ccaa => grouped[ccaa].deceased);
          totalSinITV     = aaccs.map(ccaa => grouped[ccaa].vehicles_without_mot);
          drawChart();

        }catch (err) {
      console.error('Error cargando /traffic-accidents:', err);
      }
    };

      function drawChart(){

        console.log('DATA crudo:', data);

        c3.generate({
          bindto: '#trafficChart',
          data: {
            x: 'x',
            columns: [
              ['x', ...aaccs],
              ['Accidentes mortales', ...totalAccidentes],
              ['Fallecidos', ...totalFallecidos],
              ['Vehículos sin ITV', ...totalSinITV]
            ],
            type: 'bar',
            colors: {
              'Accidentes mortales': '#f6616b',  
              'Fallecidos': '#9db4ec', 
              'Vehículos sin ITV': '#74e4a4'  
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
  <h2>Accidentes de Tráfico por CCAA</h2>
  <div id="trafficChart"></div>
</section>


<style>
  #trafficChart {
    width: 100%;
    height: 400px;   
    margin: 1rem 0;
  }
</style>