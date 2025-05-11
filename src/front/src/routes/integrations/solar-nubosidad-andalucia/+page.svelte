<script>
// @ts-nocheck
import { onMount } from 'svelte';
import * as echarts from 'echarts';

let chart;
let chartDiv;

let energiaSolar = [];
let climaActual = {};

async function loadData() {
  const res1 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
  const data1 = await res1.json();

  energiaSolar = data1.filter(
    d =>
      d.year === 2024 &&
      (d.technology === "Solar FV" || d.technology === "Solar TE") &&
      d.aacc === "Andalucía"
  );

  const res2 = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Sevilla&appid=45a6bf4b561534a5a521f97c4f12cf0f&units=metric&lang=es');
  const data2 = await res2.json();

  climaActual = {
    nubosidad: data2?.clouds?.all ?? 0,
    temperatura: data2?.main?.temp ?? 0,
    humedad: data2?.main?.humidity ?? 0
  };

  drawChart();
}

function drawChart() {
  const datosFV = energiaSolar
    .filter(d => d.technology === "Solar FV")
    .map(d => ({
      name: d.aacc + " (FV)",
      value: [climaActual.nubosidad, d.energy_sold],
      temp: climaActual.temperatura,
      humedad: climaActual.humedad,
      potencia: d.installed_power,
      tecnologia: d.technology
    }));

  const datosTE = energiaSolar
    .filter(d => d.technology === "Solar TE")
    .map(d => ({
      name: d.aacc + " (TE)",
      value: [climaActual.nubosidad, d.energy_sold],
      temp: climaActual.temperatura,
      humedad: climaActual.humedad,
      potencia: d.installed_power,
      tecnologia: d.technology
    }));

  const option = {
    title: {
      text: 'Clima actual (Sevilla) vs Producción Solar en Andalucía (2024)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const d = params.data;
        const [x, y] = d.value;
        return `
          <b>${d.name}</b><br/>
          Tecnología: ${d.tecnologia}<br/>
          Nubosidad: ${x}%<br/>
          Energía vendida: ${y} GWh<br/>
          <b>Potencia instalada (radio): ${d.potencia} MW</b><br/>
          Temperatura: ${d.temp} °C<br/>
          Humedad: ${d.humedad}%<br/>
        `;
      }
    },
    legend: {
      data: ['Solar FV', 'Solar TE'],
      top: 30
    },
    xAxis: {
      name: 'Nubosidad (%)',
      min: 0,
      max: 100
    },
    yAxis: {
      name: 'Energía vendida (GWh)'
    },
    series: [
      {
        name: 'Solar FV',
        type: 'scatter',
        data: datosFV,
        symbolSize: function (val, params) {
          return Math.sqrt(datosFV[params.dataIndex].potencia) * 2;
        },
        itemStyle: {
          color: '#f68fb4'
        }
      },
      {
        name: 'Solar TE',
        type: 'scatter',
        data: datosTE,
        symbolSize: function (val, params) {
          return Math.sqrt(datosTE[params.dataIndex].potencia) * 2;
        },
        itemStyle: {
          color: '#f6f48f'
        }
      }
    ]
  };

  const myChart = echarts.init(chartDiv);
  myChart.setOption(option);
  chart = myChart;
}

onMount(() => {
  loadData();
  window.addEventListener('resize', () => chart?.resize());
});
</script>

<h2>Integración: Clima actual (Sevilla) vs Producción Solar en Andalucía</h2>
<div bind:this={chartDiv} style="width: 100%; height: 500px;"></div>
