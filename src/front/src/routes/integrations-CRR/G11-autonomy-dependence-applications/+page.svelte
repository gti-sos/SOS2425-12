<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    let canvas;
    let chart;
  
    let totalPoblacion = 0;
    let totalEnergia = 0;
  
    async function loadData() {
      const Chart = (await import('chart.js/auto')).default;
  
      const res1 = await fetch('https://sos2425-11.onrender.com/api/v1/autonomy-dependence-applications');
      const res2 = await fetch('http://localhost:16078/api/v1/annual-evolutions');
  
      const data1 = await res1.json();
      const data2 = await res2.json();
  
      if (!Array.isArray(data1) || !Array.isArray(data2)) {
        console.error("Error: las respuestas no son arrays.");
        return;
      }
  
      // Sumar toda la población de 2023
      totalPoblacion = data1
        .filter(d => d.year === 2023)
        .reduce((acc, d) => acc + (d.population || 0), 0);
  
      // Sumar toda la energía vendida de 2023
      totalEnergia = data2
        .filter(d => d.year === 2023)
        .reduce((acc, d) => acc + (d.energy_sold || 0), 0);
  
      console.log("Población total (2023):", totalPoblacion);
      console.log("Energía vendida total (2023):", totalEnergia);
  
      drawChart();
    }
  
    function drawChart() {
      const data = {
        labels: ['Población Total', 'Energía Vendida Total'],
        datasets: [{
          label: 'España - 2023',
          data: [totalPoblacion, totalEnergia],
          backgroundColor: ['#36a2eb', '#ff6384'],
          hoverOffset: 4
        }]
      };
      console.log(data);
      const config = {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Población vs Energía Vendida - España (2023)'
            }
          }
        }
      };
  
    }
  
    onMount(loadData);

    console.log(canvas);
    if (canvas) {
      chart = new Chart(canvas, config);
    }
  </script>
  
  <h2>Integración G11-autonomy-dependence-applications</h2>
  <canvas bind:this={canvas} style="width: 100%; max-width: 500px; height: 400px;"></canvas>
  