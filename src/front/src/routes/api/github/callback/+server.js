// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

const CLIENT_ID = 'Ov23linopbdyVmeNezLw';
const CLIENT_SECRET = '9a383f924ab1da79f3f112f33f1368551e996fdd';

export async function GET({ url }) {
  const code = url.searchParams.get('code');

  // Pedir access token a GitHub
  const res = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code
  }, {
    headers: { Accept: 'application/json' }
  });

  const access_token = res.data.access_token;

  // Obtener datos del usuario
  const userRes = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'User-Agent': 'sveltekit-oauth-app'
    }
  });

  const login = userRes.data.login;

  // Redirigir al frontend con el nombre de usuario
  throw redirect(302, `/integrations/CRR/potencia-tecnologias-github?login=${login}`);
}
