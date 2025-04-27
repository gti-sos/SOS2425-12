<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
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
</style>

<script>
    // @ts-nocheck
    import { onMount } from "svelte";

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
        let filtered = selectedAacc
            ? data.filter(d => d.aacc === selectedAacc)
            : data;

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
                text: selectedAacc
                    ? `Consumo y emisiones en ${selectedAacc}`
                    : 'Consumo y emisiones energéticas por año',
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
</script>

<!-- Selector de comunidad -->
<label for="aacc">Selecciona comunidad:</label>
<select id="aacc" bind:value={selectedAacc} on:change={updateChart}>
    <option value="">Todas</option>
    {#each aaccs as aacc}
        <option value={aacc}>{aacc}</option>
    {/each}
</select>
<div id="container" style="width: 100%; height: 500px;"></div>
