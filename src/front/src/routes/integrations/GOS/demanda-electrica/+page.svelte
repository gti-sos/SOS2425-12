<!-- svelte-ignore css_unused_selector -->
<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
// @ts-nocheck
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let chart;
    let chartContainer;

    onMount(async () => {
        const data = await fetchData();
        console.log('data', data);
        drawGraph(data);
    });

    async function fetchData() {
        const res = await fetch('https://apidatos.ree.es/es/datos/demanda/evolucion?start_date=2019-01-01T00:00&end_date=2022-01-31T23:59&time_trunc=year');
        return await res.json();
    }

    function processData(data) {
        const values = data?.included?.[0]?.attributes?.values || [];
        return [{
            name: 'Demanda (MWh)',
            data: values.map(v => parseFloat((v.value / 1_000_000).toFixed(2))) // en millones
        }];
    }

    function createChartOptions(series, data) {
        const values = data?.included?.[0]?.attributes?.values || [];
        return {
            chart: {
                type: 'scatter',
                height: 400
            },
            title: {
                text: 'Evolución de la demanda eléctrica en España (REE)'
            },
            xaxis: {
                categories: values.map(v => new Date(v.datetime).getFullYear())
            },
            series
        };
    }

    function renderChart(options) {
        chart = new ApexCharts(chartContainer, options);
        chart.render();
    }

    function drawGraph(data) {
        const series = processData(data);
        const options = createChartOptions(series, data);
        renderChart(options);
    }
</script>

<style>
    .apexcharts-marker {
        r: 6px !important;
    }
</style>

<h2>Demanda eléctrica anual - España</h2>
<div bind:this={chartContainer}></div>

<button class="pink" on:click={() => goto(`/integrations`)}>Atrás</button>