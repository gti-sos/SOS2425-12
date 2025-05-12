<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { tick } from 'svelte';
import { goto } from '$app/navigation';

let charts = [];
let selectedAacc = '';
let selectedYearToDownload = '';

const años = [2022, 2021, 2020, 2019, 2018, 2017];
const tipos = ['Biocombustibles', 'Fueloil', 'Otros productos petrolíferos', 'Carbón y coque'];

const comunidadesAutonomas = ["País Vasco", "Andalucía", "Balears, Illes", "Ceuta", "Murcia, Región de", "Extremadura", "Melilla",
        "Comunitat Valenciana", "Madrid, Comunidad de", "Galicia", "Canarias", "Navarra, Comunidad Foral de",
        "Castilla y León", "Castilla - La Mancha", "Cantabria", "Asturias, Principado de", "Cataluña" ];

let datosFiltrados = [];
let annual_consumptions = [];
let fusionados = [];

onMount(async () => {
        try {
                const response = await fetch('https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/31411');
                const data = await response.json();
                const filtrados = filtrarDatos(data);
                datosFiltrados = formatearDatosFiltrados(filtrados);

                await getAnnualConsumptions();
                fusionados = fusionarDatosExtendidos(annual_consumptions, datosFiltrados);
                console.log('fuuusion', fusionados);

        } catch (error) {
                console.error('Error fetching data:', error);
        }
});

function filtrarDatos(data) {
        return data.filter(item => 
                tipos.some(tipo => item.Nombre.includes(tipo))
        );
}

function formatearDatosFiltrados(data) {
        return data
                .map((entry) => {
                        const [aacc, producto] = entry.Nombre.split(",").map(e => e.trim());

                        if (!comunidadesAutonomas.includes(aacc)) return [];

                        return entry.Data
                                .filter(d => años.includes(parseInt(d.NombrePeriodo)))
                                .map(d => ({
                                        aacc,
                                        year: parseInt(d.NombrePeriodo),
                                        producto,
                                        valor: d.Valor
                                }));
                })
                .flat();
}

async function getAnnualConsumptions() {
        try {  
                const miAPI = "https://sos2425-12.onrender.com/api/v1/annual-consumptions";
                const res = await fetch(miAPI, { method: "GET" });
                annual_consumptions = await res.json();
                console.log(`Response received`);
        } 
        catch (error) {
                console.error(`ERROR: GET from ${miAPI}: ${error}`);
        }
}

function fusionarDatosExtendidos(baseArray, extraArray) {
    return baseArray.map(entry => {
        const extras = extraArray.filter(
            e => e.aacc === entry.aacc && e.year === entry.year
        );

        const extendido = { ...entry };

        extras.forEach(e => {
            if (e.producto && typeof e.valor === "number") {
                extendido[e.producto] = e.valor;
            }
        });

        return extendido;
    });
}

async function drawCharts() {
        await tick();
        charts.forEach(chart => chart.destroy());
        charts = [];

        const filtered = fusionados.filter(d => d.aacc === selectedAacc);

        const grouped = {};
        filtered.forEach(d => {
                if (!grouped[d.year]) {
                        grouped[d.year] = {
                                electricity: 0,
                                gas: 0,
                                other: 0,
                                Fueloil: 0,
                                Biocombustibles: 0,
                                "Otros productos petrolíferos": 0,
                                "Carbón y coque": 0
                        };
                }
                grouped[d.year].electricity += d.electricity || 0;
                grouped[d.year].gas += d.gas || 0;
                grouped[d.year].other += d.other || 0;
                grouped[d.year].Fueloil += d.Fueloil || 0;
                grouped[d.year]["Biocombustibles"] += d.Biocombustibles || 0;
                grouped[d.year]["Otros productos petrolíferos"] += d["Otros productos petrolíferos"] || 0;
                grouped[d.year]["Carbón y coque"] += d["Carbón y coque"] || 0;
        });

        Object.keys(grouped).sort().forEach((year) => {
                const options = {
                        chart: {
                                type: 'polarArea',
                                height: 400,
                                width: 400
                        },
                        series: [
                                grouped[year].electricity,
                                grouped[year].gas,
                                grouped[year].other,
                                grouped[year].Fueloil,
                                grouped[year]["Biocombustibles"],
                                grouped[year]["Otros productos petrolíferos"],
                                grouped[year]["Carbón y coque"]
                        ],
                        labels: [
                                'Electricidad',
                                'Gas',
                                'Fueloil',
                                'Biocombustibles',
                                'Otros productos petrolíferos',
                                'Carbón y coque'
                        ],
                        colors: [
                                '#36A2EB', // Electricidad
                                '#FF6384', // Gas
                                '#9966FF', // Fueloil
                                '#4BC0C0', // Biocombustibles
                                '#FF9F40', // Otros productos petrolíferos
                                '#FFCE56'  // Carbón y coque
                        ],
                        title: {
                                text: `Distribución de consumo en ${year}`,
                                align: 'center'
                        }
                };

                const chart = new ApexCharts(document.getElementById(`chart-${year}`), options);
                chart.render();
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

        .download-controls {
                float: right;
                margin: 1rem;
        }

        .chart-wrapper {
                width: 400px; 
                height: 400px; 
        }

        label, select {
                margin: 1rem;
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

<label for="aacc">Seleccionar comunidad:</label>
<select id="aacc" bind:value={selectedAacc} on:change={drawCharts}>
        <option value="">-- Elige una comunidad --</option>
        {#each comunidadesAutonomas as aacc}
                <option value={aacc}>{aacc}</option>
        {/each}
</select>

{#if selectedAacc}
        <div class="download-controls">
                <label for="yearSelect">Descargar gráfico de:</label>
                <select id="yearSelect" bind:value={selectedYearToDownload}>
                        <option value="">-- Selecciona año --</option>
                        {#each [...new Set(fusionados.filter(d => d.aacc === selectedAacc).map(d => d.year))] as year}
                                <option value={year}>{year}</option>
                        {/each}
                </select>
                <button on:click={() => downloadChart(selectedYearToDownload)} disabled={!selectedYearToDownload}>
                        Descargar
                </button>
        </div>

        <div class="charts-container">
                {#each [...new Set(fusionados.filter(d => d.aacc === selectedAacc).map(d => d.year))] as year}
                        <div class="chart-wrapper">
                                <div id={`chart-${year}`}></div>
                        </div>
                {/each}
        </div>
{/if}

<button class="pink" on:click={() => goto(`/integrations`)}>Atrás</button>
