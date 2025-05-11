import express from 'express';
import cors from 'cors';
import axios from 'axios';
import request from 'request';

const app = express();
app.use(cors());

// Parámetros OAuth de tu app GitHub
const CLIENT_ID = 'Ov23linopbdyVmeNezLw';
const CLIENT_SECRET = '9a383f924ab1da79f3f112f33f1368551e996fdd';
const REDIRECT_URI = 'http://localhost:3000/callback';
// URL a la que GitHub redirige al usuario después de iniciar sesión y autorizar tu aplicación.

// Redirige a GitHub para autorizar
app.get('/auth/github', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// GitHub redirige aquí con el "code"
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const tokenUrl = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`;

  const options = {
    url: tokenUrl,
    headers: { 'Accept': 'application/json' }
  };

  // Pide el access_token a GitHub
  request.post(options, (err, response, body) => {
    const accessToken = JSON.parse(body).access_token;
    const userOptions = {
      url: 'https://api.github.com/user',
      headers: {
        'User-Agent': 'sos2425-app',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    // Pide datos del usuario
    request.get(userOptions, (err, response, body) => {
    const user = JSON.parse(body);
    const login = user.login;
    
    // 🔁 Redirige al frontend con el nombre de usuario en la URL
    res.redirect(`http://localhost:16078/integrations/potencia-tecnologias-github?login=${login}`);
        });  
    });
});

// Proxy general tipo presentación
const apiPath = '/api/github';
const githubApiBase = 'https://api.github.com';

app.use(apiPath, (req, res) => {
  const url = githubApiBase + req.url;
  console.log('Proxying request to:', url);
  req.pipe(request(url)).pipe(res);
});

app.listen(3000, () => {
  console.log('Proxy GitHub OAuth escuchando en http://localhost:3000');
});
