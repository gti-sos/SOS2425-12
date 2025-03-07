const express = require("express");
const gosAlgorithm = require("./samples/GOS/index.js");
const fagAlgorithm = require("./samples/FAG/index.js");
const crrAlgorithm = require("./samples/CRR/index.js");
const cool = require("cool-ascii-faces")

const app = express();
const PORT = process.env.PORT || 16078;

app.use("/", express.static(__dirname));

app.get("/samples/FAG", (req, res) => {
    res.send(fagAlgorithm());
});

app.get("/samples/GOS", (req, res) => {
    try {
        const result = gosAlgorithm(); 
        res.send(`<pre>${result}</pre>`); 
    } catch (error) {
        console.error("Error al ejecutar el algoritmo:", error);
    }
});

app.get("/samples/CRR", (request, response) => {
    res.send(crrAlgorithm());
});

app.get("/cool", (request, response) => {
    response.send(cool());
});

app.get("/", (request, response) => {
    response.redirect("/about");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
