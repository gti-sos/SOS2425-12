<script>
  // @ts-nocheck
  import { onMount, tick } from 'svelte';
  let canvas;
  let Chart;
  let chart;

  let energia2023 = 0;
  let energia2024 = 0;
  let poblacion2023 = 0;
  let poblacion2024 = 0;

  async function loadData() {
    const res1 = await fetch('https://sos2425-11.onrender.com/api/v1/autonomy-dependence-applications');
    const res2 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');

    const data1 = await res1.json();
    const data2 = await res2.json();

    poblacion2023 = data1
      .filter(d => d.year === 2023)
      .reduce((acc, d) => acc + (d.population || 0), 0);

    poblacion2024 = data1
      .filter(d => d.year === 2024)
      .reduce((acc, d) => acc + (d.population || 0), 0);

    energia2023 = data2
      .filter(d => d.year === 2023)
      .reduce((acc, d) => acc + (d.energy_sold || 0), 0);

    energia2024 = data2
      .filter(d => d.year === 2024)
      .reduce((acc, d) => acc + (d.energy_sold || 0), 0);

    drawChart();
  }

  function drawChart() {
    const data = {
      labels: [
        'Energía Vendida 2023',
        'Energía Vendida 2024',
        'Población 2023',
        'Población 2024'
      ],
      datasets: [{
        label: 'España',
        data: [energia2023, poblacion2023,  energia2024,poblacion2024],
        backgroundColor: ['#8c87f9', '#adddf8', '#de54f3', '#f5adf8'],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'doughnut',
      data,
      options: {
        responsive: false, // evita que ignore el width/height
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Población y Energía Vendida - España (2023 vs 2024)'
          },

        }
      }
    };

    if (chart) {
      chart.destroy();
    }
    chart = new Chart(canvas, config);
  }

  onMount(async () => {
    Chart = (await import('chart.js/auto')).default;
    await tick();
    await loadData();
  });
</script>

<h2>Integración G11-autonomy-dependence-applications</h2>
<canvas bind:this={canvas} width="500" height="500" style="width: 100%; max-width: 500px;"></canvas>
