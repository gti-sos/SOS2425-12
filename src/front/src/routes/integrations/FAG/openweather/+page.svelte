<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let weatherData = null;
  let error = null;
  const apiKey = '4f84c2bfff7f3e22d80332a9e34c45d1';
  const city = 'Seville';
  const units = 'metric'; // Para obtener la temperatura en Celsius
  const lang = 'es';     // Para obtener la descripción del clima en español

  onMount(async () => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.status} ${response.statusText}`);
      }
      weatherData = await response.json();
      console.log('Weather Data:', weatherData);
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });

  function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
</script>

<svelte:head>
  <title>Clima en Sevilla - OpenWeatherMap</title>
</svelte:head>

<div class="container">
  <h1>El Tiempo en Sevilla</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if !weatherData}
    <p>Cargando datos del clima...</p>
  {:else}
    <div class="weather-card">
      {#if weatherData.weather && weatherData.weather[0]}
        <img src={getWeatherIconUrl(weatherData.weather[0].icon)} alt="Icono del clima">
        <h2>{weatherData.weather[0].description}</h2>
      {/if}
      {#if weatherData.main}
        <p class="temperature">{Math.round(weatherData.main.temp)}°C</p>
        <p>Sensación térmica: {Math.round(weatherData.main.feels_like)}°C</p>
        <p>Humedad: {weatherData.main.humidity}%</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .weather-card {
    background-color: #e6f7ff;
    border: 1px solid #aaddff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  img {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }

  h2 {
    color: #337ab7;
    margin-bottom: 10px;
  }

  p {
    color: #555;
    margin-bottom: 5px;
  }

  .temperature {
    font-size: 1.5em;
    font-weight: bold;
    color: #ff8c00;
    margin-bottom: 10px;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>