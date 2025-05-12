<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let ipAddress = null;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ipify');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error fetching IP: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      ipAddress = data.ip;
      console.log('IP Address:', ipAddress);
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Mi Dirección IP (vía Proxy)</title>
</svelte:head>

<div class="container">
  <h1>Mi Dirección IP (vía Proxy)</h1>

  {#if error}
    <p class="error">Error: {error}</p>
  {:else if !ipAddress}
    <p>Cargando dirección IP...</p>
  {:else}
    <p>Tu dirección IP es: <strong>{ipAddress}</strong></p>
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

  p {
    color: #555;
    font-size: 1.2em;
  }

  strong {
    font-weight: bold;
    color: #007bff;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>