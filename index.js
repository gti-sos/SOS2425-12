const express = require("express");
const gosAlgorithm = require("./samples/GOS/index.js");
const fagAlgorithm = require("./samples/FAG/index.js");
const crrAlgorithm = require("./samples/CRR/index.js");
const cool = require("cool-ascii-faces");

const BASE_API = "/api/v1"

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

let anual_evolutions = [];

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

app.get(BASE_API + "/anual-evolutions/loadInitialData", (request, response) => {
    console.log("New GET to /loadInitialData");
    if (anual_evolutions.length > 0) {
        return response.status(400).json({ message: "El array ya contiene datos" });
    }
    else{

        anual_evolutions = [
            { year: 2005, aacc: "Andalucía", technology: "Biomasa", energy_sold: 726.24343, installed_power: 127.98, load_factor: 64.7792606 },
            { year: 2005, aacc: "Andalucía", technology: "Cogeneración", energy_sold: 2975.02877, installed_power: 630.88, load_factor: 53.83197436 },
            { year: 2005, aacc: "Andalucía", technology: "Eólica", energy_sold: 910.74752, installed_power: 443.53, load_factor: 23.44071643 },
            { year: 2005, aacc: "Aragón", technology: "Eólica", energy_sold: 3139.8603, installed_power: 1408.71, load_factor: 25.4434952 },
            { year: 2007, aacc: "Asturias, Principado de", technology: "Cogeneración", energy_sold: 243.3279, installed_power: 72.25, load_factor: 38.4458928 },
            { year: 2007, aacc: "Asturias, Principado de", technology: "Eólica", energy_sold: 398.53, installed_power: 213.66, load_factor: 21.2928448 },
            { year: 2007, aacc: "Asturias, Principado de", technology: "Hidráulica", energy_sold: 208.3477, installed_power: 77.47, load_factor: 30.7008959 },
            { year: 2008, aacc: "Ceuta", technology: "Residuos", energy_sold: 4.81, installed_power: 2.8, load_factor: 19.6102414 },
            { year: 2008, aacc: "Ceuta", technology: "Solar FV", energy_sold: 0.0488, installed_power: 0.1, load_factor: 50.6432406 },
            { year: 2008, aacc: "Comunitat Valenciana", technology: "Biomasa", energy_sold: 18.6612, installed_power: 11.8, load_factor: 18.0531693 },
            { year: 2008, aacc: "Comunitat Valenciana", technology: "Cogeneración", energy_sold: 1331.9947, installed_power: 654.46, load_factor: 23.2335344 },
            { year: 2009, aacc: "Murcia, Región de", technology: "Trat.residuos", energy_sold: 367.1823, installed_power: 69.576, load_factor: 60.2446069 },
            { year: 2009, aacc: "Navarra, Comunidad Foral de", technology: "Biomasa", energy_sold: 339.5784, installed_power: 40.51, load_factor: 95.6915762 }
        ];
        console.log(anual_evolutions);

        response.status(201).json(anual_evolutions);
    }
});