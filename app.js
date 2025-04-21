const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();
console.log("GEODB API KEY:", process.env.GEODB_API_KEY);

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.set("view engine", "pug");

// Home Route – shows list of cities (GeoDB)
app.get("/", async (req, res) => {
  const geoUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&sort=-population";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.GEODB_API_KEY,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(geoUrl, options);
    const data = await response.json();
    res.render("index", { cities: data.data });
  } catch (err) {
    console.error("GeoDB Error:", err);
    res.send("Failed to load cities");
  }
});

//  New JSON route for React frontend
app.get("/api/cities", async (req, res) => {
  const geoUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&sort=-population";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.GEODB_API_KEY,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(geoUrl, options);
    const data = await response.json();

    console.log("GOT FROM GeoDB:", data);

    // ✅ NEW: handle rate limit message
    if (data.message) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment." });
    }

    if (!data || !data.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    res.json(data.data);
  } catch (err) {
    console.error("API JSON error:", err.message || err);
    res.status(500).json({ error: "Failed to load cities" });
  }
});

// City Route – shows weather for selected city
app.get("/city/:name", async (req, res) => {
  const cityName = req.params.name;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

  try {
    const response = await fetch(weatherUrl);
    const weather = await response.json();
    res.render("city", { city: cityName, weather });
  } catch (err) {
    console.error("Weather Error:", err);
    res.send("Failed to load weather");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
