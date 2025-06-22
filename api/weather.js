// api/weather.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
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

    res.status(200).json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
