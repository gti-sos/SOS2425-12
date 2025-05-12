import { json } from '@sveltejs/kit';

export async function GET() {
  const url = 'https://sos2425-13.onrender.com/api/v2/national-parks';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Error del proxy: ${res.status}`, { status: res.status });
    }

    const data = await res.json();
    return json(data);
  } catch (err) {
    return new Response('Error interno del servidor', { status: 500 });
  }
}