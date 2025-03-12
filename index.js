const express = require("express");
const gosAlgorithm = require("./samples/GOS/index.js");
const fagAlgorithm = require("./samples/FAG/index.js");
const crrAlgorithm = require("./samples/CRR/index.js");
const cool = require("cool-ascii-faces");

const BASE_API = "api/v1"

const app = express();
const PORT = process.env.PORT || 16078;

app.use("/", express.static(__dirname));
app.use(express.json());

//L04 

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
    response.send(crrAlgorithm());
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


//L05 

let anual_evolutions = [
    {
        aacc : "Andalucía",
        technology : "Biomasa",
        energy_sold : 726.24343,
        installed_power : 127.98,
        load_factor: 64.7792606 
    },

    {
        aacc : "Murcia, Región de",
        technology : "Trat.residuos",
        energy_sold : 367.1823,
        installed_power : 69.576,
        load_factor: 60.2446069 
    }
];

app.get(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New GET to /anual-evolutions");
    response.send(JSON.stringify(anual_evolutions));
});

app.post(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New POST to /anual-evolutions");
    let newData = request.body;
    anual_evolutions.push(newData);
    response.sendStatus(201);

});
