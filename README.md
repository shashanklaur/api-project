# Travel Buddy 🌍

A smart travel recommendation app built with Express and Pug that shows trending global cities and their real-time weather.

---

## 📦 Features
- 🔥 Popular cities via [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities)
- 🌤️ Real-time weather from [OpenWeatherMap API](https://openweathermap.org/api)
- 🧠 Clean and minimalist layout using Pug templates and CSS

---
## ⚙️ Setup Instructions

### 1. Clone the repo

### 2. Install dependencies

npm install

### 3. Add .env file
Create a .env file in the root folder:

PORT=3000
GEODB_API_KEY=your_geodb_api_key
WEATHER_API_KEY=your_openweather_api_key

### 4. Run the server

node app.js