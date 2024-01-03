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
  console.log(city);
  try {
    const coordinatesResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const data = coordinatesResponse.data;
    const lat = data[0].lat;
    const lon = data[0].lon;
    const cityResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${apiKey}&units=metric`
    );
    res.status(200).render("index.ejs", { data: cityResponse.data });
  } catch (error) {
    const err = "Location you entered does not exist. Please try again! ";
    console.log(err);
    res.render("index.ejs", {
      error: "Location you entered does not exist. Please try again!",
    });
  }

  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
