<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</svelte:head>

<style>
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 360px;
        max-width: 800px;
        margin: 1em auto;
    }

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #ebebeb;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }

    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tbody tr:nth-child(even) {
        background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }

    .highcharts-description {
        margin: 0.3rem 10px;
    }

    button.pink {
      background-color: #ff69b4;
      color: white;
      border: 1px solid #c71585;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    button.pink:hover {
      background-color: #c71585;
      border-color: #c71585;
    }
</style>

<h1>Comparativa de Consumo Energético por Comunidad</h1>

<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let data = [];
    let aaccs = [];
    let selectedAacc = "";

    onMount(async () => {
        const res = await fetch("/api/v1/annual-consumptions");
        data = await res.json();
        aaccs = [...new Set(data.map(d => d.aacc))].sort();
        updateChart();
    });

    function updateChart() {
        if (selectedAacc === "") return;
        let filtered = selectedAacc === "__ALL__"
        ? data
        : data.filter(d => d.aacc === selectedAacc);


        const grouped = {};
        filtered.forEach(d => {
            const year = d.year;
            if (!grouped[year]) {
                grouped[year] = { electricity: 0, gas: 0, other: 0, co2: 0 };
            }
            grouped[year].electricity += d.electricity;
            grouped[year].gas += d.gas;
            grouped[year].other += d.other;
            grouped[year].co2 += d.co2_emission;
        });

        const categories = Object.keys(grouped).sort();
        const electricity = categories.map(y => grouped[y].electricity);
        const gas = categories.map(y => grouped[y].gas);
        const other = categories.map(y => grouped[y].other);
        const co2 = categories.map(y => grouped[y].co2);

        Highcharts.chart('container', {
            chart: { zoomType: 'xy' },
            title: {
                text: 'Consumo y emisiones energéticas por año',
                align: 'left'
            },
            xAxis: { categories },
            yAxis: [
                {
                    title: { text: 'Consumo (MWh)' },
                    stackLabels: { enabled: true }
                },
                {
                    title: { text: 'Emisiones CO₂ (ton)' },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: { stacking: 'normal' }
            },
            exporting: { 
                enabled: false
            },
            series: [
                {
                    name: 'Electricidad',
                    type: 'column',
                    data: electricity,
                    yAxis: 0
                },
                {
                    name: 'Gas',
                    type: 'column',
                    data: gas,
                    yAxis: 0
                },
                {
                    name: 'Otros',
                    type: 'column',
                    data: other,
                    yAxis: 0
                },
                {
                    name: 'CO₂',
                    type: 'spline',
                    data: co2,
                    yAxis: 1,
                    marker: { enabled: true },
                    color: 'red',
                    tooltip: {
                        valueSuffix: ' t CO₂'
                    }
                }
            ]
        });
    }

    function downloadChart() {
        if (!selectedAacc) return;

        const container = document.getElementById('container');
        if (container) {
            html2canvas(container).then((canvas) => {
                const link = document.createElement('a');
                let filename = selectedAacc === "__ALL__" ? "consumo_todas_comunidades" : `consumo_${selectedAacc.replace(/\s+/g, '_').toLowerCase()}`;
                link.href = canvas.toDataURL('image/png');
                link.download = `${filename}.png`;
                link.click();
            });
        }
    }


</script>

<!-- Selector de comunidad -->
<label for="aacc">Selecciona comunidad:</label>
<select id="aacc" bind:value={selectedAacc} on:change={updateChart}>
    <option value="">-- Selecciona una comunidad --</option>
<option value="__ALL__">Todas</option>
{#each aaccs as aacc}
  <option value={aacc}>{aacc}</option>
{/each}
</select>
{#if selectedAacc}
    <div style="text-align: right; margin: 1rem;">
        <button on:click={downloadChart}>
            Descargar gráfico
        </button>
    </div>
    <div id="container" style="width: 100%; height: 500px;"></div>
{/if}
<button class="pink" on:click={() => goto(`/annual-consumptions`)}> Atrás </button>
