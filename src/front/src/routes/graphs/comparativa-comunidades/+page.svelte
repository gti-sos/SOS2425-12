<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Chart } from 'chart.js/auto';

    let data = [];
    let aaccs = [];
    let selectedAacc = "";
    let charts = [];

    onMount(async () => {
        const res = await fetch("/api/v1/annual-consumptions");
        data = await res.json();
        aaccs = [...new Set(data.map(d => d.aacc))].sort();
    });

    function drawCharts() {
        // Primero limpiamos gráficos antiguos
        charts.forEach(chart => chart.destroy());
        charts = [];

        const filtered = data.filter(d => d.aacc === selectedAacc);

        const grouped = {};
        filtered.forEach(d => {
            if (!grouped[d.year]) {
                grouped[d.year] = { electricity: 0, gas: 0, other: 0 };
            }
            grouped[d.year].electricity += d.electricity;
            grouped[d.year].gas += d.gas;
            grouped[d.year].other += d.other;
        });

        // Dibujar un gráfico para cada año
        Object.keys(grouped).sort().forEach((year) => {
            const ctx = document.getElementById(`chart-${year}`).getContext('2d');
            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Electricidad', 'Gas', 'Otros'],
                    datasets: [{
                        data: [
                            grouped[year].electricity,
                            grouped[year].gas,
                            grouped[year].other
                        ],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(255, 206, 86, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Distribución de consumo en ${year}`
                        }
                    }
                }
            });

            charts.push(chart);
        });
    }
</script>

<style>
    .charts-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
    }

    .chart-wrapper {
        width: 400px; 
        height: 400px; 
    }

    label, select {
        margin: 1rem;
    }
</style>


<h1>Comparativa de Consumo Energético por Comunidad</h1>

<label for="aacc">Seleccionar comunidad:</label>
<select id="aacc" bind:value={selectedAacc} on:change={drawCharts}>
    <option value="">-- Elige una comunidad --</option>
    {#each aaccs as aacc}
        <option value={aacc}>{aacc}</option>
    {/each}
</select>

{#if selectedAacc}
    <div class="charts-container">
        {#each [...new Set(data.filter(d => d.aacc === selectedAacc).map(d => d.year))].sort() as year}
            <div class="chart-wrapper">
                <canvas id={`chart-${year}`}></canvas>
            </div>
        {/each}
    </div>
{/if}