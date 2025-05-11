<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { tick } from 'svelte';
    let Plotly; // Declaramos Plotly sin importarlo aún
  
    let data = [];
    let selectedYear = '';
    let years = [];
    let sectors = [];
  
    async function loadData() {
      Plotly = await import('plotly.js-dist-min'); // Importación dinámica de Plotly
  
      const res = await fetch('https://sos2425-18.onrender.com/api/v2/dana-erte-stats');
      data = await res.json();
  
      years = [...new Set(data.map(d => d.request_year))];
      sectors = [...new Set(data.map(d => d.sector))];
  
      console.log(years);

      selectedYear = 2024; // Preseleccionamos un año
      drawCharts();
    }
  
    async function drawCharts() {
      // Filtrar por año seleccionado
      const filteredData = data.filter(d => d.request_year == selectedYear);
  
      // Eliminar gráficos anteriores
      const container = document.getElementById('erteChartContainer');
      container.innerHTML = '';

      await tick();
  
      // Por cada sector, generar un gráfico tipo "pie"
      sectors.forEach(sector => {
        const sectorData = filteredData.filter(d => d.sector === sector);
  
        const comunidades = [...new Set(sectorData.map(d => d.company_municipality))].sort();
        const valores = comunidades.map(c =>
          sectorData
            .filter(d => d.company_municipality === c)
            .reduce((acc, curr) => acc + curr.total_work_sus, 0)
        );
  
        const divId = `erteChart-${sector.replace(/\s+/g, '-')}`;
        const chartDiv = document.createElement('div');
        chartDiv.id = divId;
        chartDiv.style.width = '100%';
        chartDiv.style.height = '400px';
        chartDiv.style.marginBottom = '2rem';
        container.appendChild(chartDiv);
  
        Plotly.newPlot(divId, [{
          labels: comunidades,
          values: valores,
          type: 'pie',
          textinfo: 'label+percent',
          hole: 0.3
        }], {
          title: `Distribución de ERTEs en ${sector} - ${selectedYear}`
        });
      });
    }
  
    onMount(loadData);
  </script>
  
  <h2>Integración G18-dana-erte-stats</h2>
  
  <div style="margin-bottom: 1rem;">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>Año:</label>
    <select bind:value={selectedYear} on:change={drawCharts}>
      {#each years as year}
        <option value={year}>{year}</option>
      {/each}
    </select>
  </div>
  
  <div id="erteChartContainer"></div>
  