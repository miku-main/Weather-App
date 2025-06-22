// backend/server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env
dotenv.config();

// Fix for __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (optional if frontend served from same origin)
app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API route to proxy OpenWeatherMap requests
app.get('/api/weather', async (req, res) => {
  const { city, type } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city || !type) {
    return res.status(400).json({ error: 'Missing city or type query parameters.' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/${type}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// Catch-all route to serve frontend SPA (for React, Vue, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
