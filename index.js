import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render ("index.ejs")
})


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
