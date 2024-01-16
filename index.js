import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/add", async (req, res) => {
  const apiKey = process.env.API_KEY;
  const { city } = req.body;
  const cityNameModified = city.split(" ");
  console.log(cityNameModified)

  for (let i = 0; i < cityNameModified.length; i++) {
   cityNameModified[i] = cityNameModified[i][0].toUpperCase() + cityNameModified[i].slice(1).toLowerCase()
    
  }

 

  try {
    const coordinatesResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const data = coordinatesResponse.data;
    const lat = data[0].lat;
    const lon = data[0].lon;
    const cityResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=metric`
    );

    console.log(cityResponse.data.current.weather[0]);
    // Current Forecast

    const description = cityResponse.data.current.weather[0].description.split(
      " "
    );
    console.log(description)
    for (let i = 0; i < description.length; i++) {
      description[i]= description[i][0].toUpperCase() + description[i].slice(1);
    };

    const timestampCurrent = cityResponse.data.current.dt * 1000;
    const date = new Date(timestampCurrent);
    const timezoneDate = date.toLocaleString(undefined, {timeZone: cityResponse.data.timezone, weekday:"long", hour: "numeric", minute:"numeric"});

    // // Daily Forecast

    const timestampDaily = cityResponse.data.daily.map((day) => {
      return day.dt * 1000
    });
    const dailyDate = timestampDaily.map((day) => {
      const date = new Date(day);
      const timezoneDate = date.toLocaleString(undefined, {timeZone: cityResponse.data.timezone, weekday:"long"});
      return timezoneDate

    });
    console.log(dailyDate)
    


    res.status(200).render("index.ejs", {
      data: cityResponse.data,
      icon: cityResponse.data.current.weather[0].icon,
      description: description.join(" "),
      city: cityNameModified.join(" "),
      date: timezoneDate,
      dates: dailyDate,
      wind: (cityResponse.data.current.wind_speed * 3.6).toFixed(1) + " km/h",
      humidity: cityResponse.data.current.humidity + "%",
      timeZone: cityResponse.data.timezone,
      precipitation: Math.round(cityResponse.data.hourly[0].pop * 10) + "%"
      
    });
  } catch (error) {
    const err = "Location you entered does not exist. Please try again! ";
    console.log(err);
    res.render("index.ejs", {
      error: "Location you entered does not exist. Please try again!",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
