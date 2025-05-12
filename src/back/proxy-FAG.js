import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/api/ipify', async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying IPify API:', error);
    res.status(500).json({ error: 'Failed to fetch IP address' });
  }
});

app.listen(3001, () => {
  console.log('Proxy API escuchando en http://localhost:3001');
});