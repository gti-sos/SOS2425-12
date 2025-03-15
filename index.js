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

//Clara
let anual_evolutions = [];

//GET
app.get(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New GET to /anual-evolutions");
    response.send(JSON.stringify(anual_evolutions));
});

//POST
app.post(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New POST to /anual-evolutions");
    let newData = request.body;
    if (anual_evolutions.some(x =>  x.year === newData.year && x.aacc === newData.aacc && x.technology === newData.technology)){
        return response.sendStatus(409).json({ error: "Ya existe" });
    }
    else{
    anual_evolutions.push(newData);
    response.sendStatus(201);
    }
});

//PUT
app.put(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New PUT to /anual-evolutions");
    response.sendStatus(405).json({error : "método PUT no permitido"});
});

//DELETE
app.delete(BASE_API + "/anual-evolutions", (request, response) => {
    console.log("New DELETE to /anual-evolutions");
    anual_evolutions = [];
    response.sendStatus(200).json(anual_evolutions);
});

//loadInitialData
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



// Fer
let annual_retributions = [];

//GET
app.get(BASE_API + "/anual-retributions", (req, res) => {
    console.log("New GET to /anual-retributions");
    res.send(JSON.stringify(annual_retributions));
});

//POST
app.post(BASE_API + "/anual-retributions", (req, res) => {
    console.log("New POST to /anual-retributions");
    let newData = req.body;
    if (annual_retributions.some(x =>  x.year === newData.year && x.aacc === newData.aacc && x.technology === newData.technology)){
        return res.sendStatus(409).json({ error: "Ya existe" });
    }
    else{
    annual_retributions.push(newData);
    res.sendStatus(201);
    }
});

//PUT
app.put(BASE_API + "/anual-retributions", (req, res) => {
    console.log("New PUT to /anual-retributions");
    res.sendStatus(405).json({error : "método PUT no permitido"});
});

//DELETE
app.delete(BASE_API + "/anual-retributions", (req, res) => {
    console.log("New DELETE to /anual-retributions");
    annual_retributions = [];
    res.sendStatus(200).json(annual_retributions);
});

//loadInitialData
app.get(BASE_API + "/anual-evolutions/loadInitialData", (req, res) => {
    console.log("New GET to /loadInitialData");
    if (annual_retributions.length > 0) {
        return res.status(400).json({ message: "El array ya contiene datos" });
    }
    else{

        annual_retributions = [
            {year: 2017, technology: "Biomasa", subsidized_energy: 3984.8567, total_compensation: 536521.12, investment_compensation: 148150.2, operation_compensation: 178340.4, specific_compensation: 326490.61, aacc: "Murcia, Región de"},
            {year: 2017, technology: "Cogeneración", subsidized_energy: 25262.1421, total_compensation: 2506572.04, investment_compensation: 81583.52, operation_compensation: 1084262.51, specific_compensation: 1165846.03, aacc: "Murcia, Región de"},
            {year: 2017, technology: "Eólica", subsidized_energy: 35149.794, total_compensation: 3860554.53, investment_compensation: 1472879.98, operation_compensation: 0, specific_compensation: 1472879.98, aacc: "Asturias, Principado de"},
            {year: 2017, technology: "Hidráulica", subsidized_energy: 1698.0004, total_compensation: 287182.82, investment_compensation: 83230.89, operation_compensation: 1063.44, specific_compensation: 84294.33, aacc: "Cataluña"},
            {year: 2017, technology: "Otras tecn. renovables", subsidized_energy: 0.2328, total_compensation: 193.46, investment_compensation: 151.2, operation_compensation: 31.22, specific_compensation: 182.42, aacc: "Murcia, Región de"},
            {year: 2017, technology: "Residuos", subsidized_energy: 2813.9292, total_compensation: 265275.15, investment_compensation: 78490.99, operation_compensation: 26614.72, specific_compensation: 105105.72, aacc: "Cataluña"},
            {year: 2017, technology: "Solar FV", subsidized_energy: 8339.3808,total_compensation: 2932739.57, investment_compensation: 2299769.37, operation_compensation: 202919.64, specific_compensation: 2502689.02, aacc: "Asturias, Principado de"},
            {year: 2017, technology: "Solar TE", subsidized_energy: 5347.6972, total_compensation: 1594779.26, investment_compensation: 1085765.22, operation_compensation: 234998.04, specific_compensation: 1320763.25, aacc: "Cataluña"},
            {year: 2017, technology: "Trat.residuos", subsidized_energy: 2419.3571, total_compensation: 292381.6, investment_compensation: 12428.54, operation_compensation: 152417.83, specific_compensation: 164846.37, aacc: "Asturias, Principado de"},
            {year: 2018, technology: "Biomasa", subsidized_energy: 3951.7731, total_compensation: 554749.98, investment_compensation: 148533.7, operation_compensation: 176419.89, specific_compensation: 324953.59, aacc: "Cataluña"},
            {year: 2018, technology: "Cogeneración", subsidized_energy: 25935.3492, total_compensation: 2713723.05, investment_compensation: 81485.92, operation_compensation: 1127022.62, specific_compensation: 1208508.54, aacc: "Asturias, Principado de"}
        ]
        console.log(annual_retributions);

        res.status(201).json(annual_retributions);
    }
});