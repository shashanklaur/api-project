const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require("dotenv");

dotenv.config();
console.log("GEODB API KEY:", process.env.GEODB_API_KEY);


const app = express();
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
