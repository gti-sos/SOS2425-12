<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { tick } from 'svelte';
let Plotly;

let selectedTech = 'Todas';
let techs = ['Todas'];
let chartDiv;

let data1 = [];
let data2 = [];
let data3 = [];
let dataPorTecnologia = {};

async function loadData() {
  Plotly = await import('plotly.js-dist-min');

  const res1 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
  data1 = await res1.json();

  const res2 = await fetch('https://sos2425-12.onrender.com/api/v2/annual-retributions');
  data2 = await res2.json();

  const res3 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-consumptions');
  data3 = await res3.json();

  const techsEvol = new Set(data1.map(d => d.technology));
  const techsRet = new Set(data2.map(d => d.technology));
  const commonTechs = [...techsEvol].filter(t => techsRet.has(t));

  techs = ['Todas', ...commonTechs];

  const years1 = new Set(data1.map(d => d.year));
  const years2 = new Set(data2.map(d => d.year));
  const years3 = new Set(data3.map(d => d.year));
  const allYears = [...years1].filter(y => years2.has(y) && years3.has(y)).sort();

  techs.forEach(tech => {
    const porAno = {};
    allYears.forEach(year => {
      const evols = tech === 'Todas'
        ? data1.filter(d => d.year === year && commonTechs.includes(d.technology))
        : data1.filter(d => d.year === year && d.technology === tech);

      const rets = tech === 'Todas'
        ? data2.filter(d => d.year === year && commonTechs.includes(d.technology))
        : data2.filter(d => d.year === year && d.technology === tech);

      const cons = data3.filter(d => d.year === year);

      porAno[year] = {
        energy_sold: evols.reduce((sum, d) => sum + (d.energy_sold ?? 0), 0),
        energy_sub: rets.reduce((sum, d) => sum + (d.subsidized_energy ?? 0), 0),
        co2: cons.reduce((sum, d) => sum + (d.co2_emission ?? 0), 0)
      };
    });
    dataPorTecnologia[tech] = porAno;
  });

  drawChart();
}

function drawChart() {
  const datos = dataPorTecnologia[selectedTech];
  const years = Object.keys(datos);

  const barSeries = [
    {
      name: 'Energía vendida',
      field: 'energy_sold',
      color: '#fd60c9'
    },
    {
      name: 'Energía subvencionada',
      field: 'energy_sub',
      color: '#6090fd'
    }
  ];

  const plotData = barSeries.map(s => ({
    x: years,
    y: years.map(y => datos[y][s.field]),
    name: s.name,
    type: 'bar',
    marker: { color: s.color }
  }));

  plotData.push({
    x: years,
    y: years.map(y => datos[y].co2),
    name: 'CO₂',
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: { color: '#bafdd1' }
  });

  const layout = {
    title: `Indicadores energéticos para ${selectedTech}`,
    barmode: 'group',
    xaxis: { title: 'Año', 
         type: 'category'
    },
    yaxis: { title: 'Valor' }
  };

  Plotly.newPlot(chartDiv, plotData, layout);
}

function onTechChange(e) {
  selectedTech = e.target.value;
  drawChart();
}

onMount(loadData);
</script>

<h2>Integración grupo 12 (Plotly + bar)</h2>
<label for="techSelect"><strong>Tecnología:</strong></label>
<select id="techSelect" on:change={onTechChange}>
  {#each techs as tech}
    <option value={tech} selected={tech === selectedTech}>{tech}</option>
  {/each}
</select>
<div bind:this={chartDiv} style="width: 60%; height: 500px; margin: auto;"></div>
