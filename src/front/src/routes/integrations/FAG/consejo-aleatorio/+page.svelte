<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let advice = null;
  let error = null;

  onMount(async () => {
    const apiUrl = 'https://api.adviceslip.com/advice';

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching advice: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      advice = data.slip.advice;
      console.log('Random Advice:', data);
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Integración: Random Advice API</title>
</svelte:head>

<div class="container">
  <h1>Consejo Aleatorio</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if !advice}
    <p>Cargando consejo aleatorio...</p>
  {:else}
    <div class="advice-card">
      <p class="advice-text">"{advice}"</p>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 200px; /* Para que el contenedor ocupe algo de espacio */
    margin: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  .advice-card {
    background-color: #f8f0e3; /* Color papiro claro */
    border: 1px solid #e0d6c1;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 80%;
  }

  .advice-text {
    color: #555;
    font-family: 'Georgia', serif; /* Una fuente con serifa que puede recordar a la escritura */
    font-size: 1.2em;
    font-style: italic;
    line-height: 1.6;
  }

  .error {
    color: red;
    font-weight: bold;
    text-align: center;
  }

  p {
    text-align: center; /* Centrar el texto de "Cargando..." y el error */
  }
</style>