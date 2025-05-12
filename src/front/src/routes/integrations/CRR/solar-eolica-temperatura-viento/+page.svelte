<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let chartDiv;
  let categorias = [];
  let solarSeries = [];
  let eolicaSeries = [];
  let avgTemp = 0;
  let avgWind = 0;

  async function loadData() {
    const data1 = await fetch('https://sos2425-12.onrender.com/api/v1/annual-evolutions');
    const res1 = await data1.json();

    const data2 = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.4&longitude=-3.7&daily=temperature_2m_max,wind_speed_10m_max&timezone=Europe%2FMadrid');
    const res2 = await data2.json();

    const solar2023 = res1.filter(d => d.year === 2023 && d.technology === "Solar FV");
    const eolica2023 = res1.filter(d => d.year === 2023 && d.technology === "Eólica");

    const ccaaSet = new Set([
      ...solar2023.map(d => d.aacc),
      ...eolica2023.map(d => d.aacc)
    ]);
    categorias = Array.from(ccaaSet).sort();

    solarSeries = categorias.map(aacc => {
      const found = solar2023.find(d => d.aacc === aacc);
      return found ? found.load_factor : null;
    });

    eolicaSeries = categorias.map(aacc => {
      const found = eolica2023.find(d => d.aacc === aacc);
      return found ? found.load_factor : null;
    });

    // Temperatura media anual
    const temps = res2.daily.temperature_2m_max;
    let totalTemp = 0, tempCount = 0;
    for (let i = 0; i < temps.length; i++) {
      const t = temps[i];
      if (typeof t === 'number' && !isNaN(t)) {
        totalTemp += t;
        tempCount++;
      }
    }
    avgTemp = tempCount > 0 ? totalTemp / tempCount : 0;

    // Viento medio anual
    const winds = res2.daily.wind_speed_10m_max;
    let totalWind = 0, windCount = 0;
    for (let i = 0; i < winds.length; i++) {
      const w = winds[i];
      if (typeof w === 'number' && !isNaN(w)) {
        totalWind += w;
        windCount++;
      }
    }
    avgWind = windCount > 0 ? totalWind / windCount : 0;

    drawChart();
  }

  async function drawChart() {
    const Highcharts = (await import('highcharts')).default;

    Highcharts.chart(chartDiv, {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Factor de carga por CCAA - Solar FV vs Eólica (2023)'
      },
      subtitle: {
        text: `Temperatura media: ${avgTemp.toFixed(1)} °C | Viento medio: ${avgWind.toFixed(1)} km/h`
      },
      xAxis: {
        categories: categorias,
        title: { text: 'Comunidad Autónoma' },
        labels: { rotation: -45 }
      },
      yAxis: {
        title: { text: 'Factor de carga (%)' }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          let html = `<b>${this.x}</b><br/>`;
          this.points.forEach(p => {
            html += `<span style="color:${p.color}">\u25CF</span> ${p.series.name}: ${p.y.toFixed(2)}%<br/>`;
            if (p.series.name === 'Solar FV') {
              html += `Temp. media: ${avgTemp.toFixed(1)} °C<br/>`;
            }
            if (p.series.name === 'Eólica') {
              html += `Viento medio: ${avgWind.toFixed(1)} km/h<br/>`;
            }
          });
          return html;
        }
      },
      credits: { enabled: false },
      series: [
        {
          name: 'Solar FV',
          data: solarSeries
        },
        {
          name: 'Eólica',
          data: eolicaSeries
        }
      ]
    });
  }

  onMount(loadData);
</script>

<h2>Solar vs Eólica según temperatura y viento por ccaa</h2>
<div bind:this={chartDiv} style="width: 100%; height: 450px;"></div>
