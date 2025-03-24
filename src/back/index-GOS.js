import dataStore from "nedb";
const BASE_API = "/api/v1"
let db = new dataStore();

function loadBackend(app){
    let annual_consumptions = [];

    //loadInitialData
    app.get(BASE_API + "/annual-consumptions/loadInitialData", (req, res) => {
        console.log("New GET to /loadInitialData");
        if (annual_consumptions.length > 0) {
            return res.status(400).json({ message: "El array ya contiene datos" });
        }
        else {
            annual_consumptions = [
                {aacc: "País Vasco", year: 2022, electricity: 1653989, gas: 830160, other: 445559, total_consumption: 2929708, co2_emission: 38903},
                {aacc: "Andalucía", year: 2022, electricity: 736139, gas: 306174, other: 53975, total_consumption: 1096288, co2_emission: 1008},
                {aacc: "Balears, Illes", year: 2022, electricity: 936136, gas: 283772, other: 133730, total_consumption: 1353638, co2_emission: 18047},
                {aacc: "Ceuta", year: 2022, electricity: 25137, gas: 2997, other: 9201, total_consumption: 37335, co2_emission: 7516},
                {aacc: "Murcia, Región de", year: 2022, electricity: 55808, gas: 4457, other: 23865, total_consumption: 84130, co2_emission: 12698},
                {aacc: "Extremadura", year: 2022, electricity: 377849, gas: 141680, other: 64635, total_consumption: 584164, co2_emission: 4851},
                {aacc: "Melilla", year: 2022, electricity: 873255, gas: 427336, other: 222283, total_consumption: 1522874, co2_emission: 14569},
                {aacc: "Comunitat Valenciana", year: 2022, electricity: 699022, gas: 280807, other: 152026, total_consumption: 1131855, co2_emission: 11592},
                {aacc: "Madrid, Comunidad de", year: 2022, electricity: 3059538, gas: 1299161, other: 461454, total_consumption: 4820153, co2_emission: 350},
                {aacc: "Galicia", year: 2022, electricity: 1556787, gas: 1854275, other: 195796, total_consumption: 3606858, co2_emission: 2327},
                {aacc: "Canarias", year: 2022, electricity: 257564, gas: 118755, other: 25752, total_consumption: 402071, co2_emission: 6396},
                {aacc: "Navarra, Comunidad Foral de", year: 2022, electricity: 955804, gas: 533971, other: 162055, total_consumption: 1651830, co2_emission: 9556},
                {aacc: "Castilla y León", year: 2022, electricity: 580695, gas: 264888, other: 80221, total_consumption: 925804, co2_emission: 21596},
                {aacc: "Castilla - La Mancha", year: 2022, electricity: 482986, gas: 294992, other: 348385, total_consumption: 1126363, co2_emission: 11063},
                {aacc: "Cantabria", year: 2022, electricity: 521745, gas: 217558, other: 119286, total_consumption: 858589, co2_emission: 4661},
                {aacc: "Asturias, Principado de", year: 2022, electricity: 1435585, gas: 776666, other: 141953, total_consumption: 2354204, co2_emission: 14488},
                {aacc: "Cataluña", year: 2022, electricity: 109882, gas: 43271, other: 15293, total_consumption: 168446, co2_emission: 1608},
                {aacc: "Ceuta", year: 2021, electricity: 941599, gas: 448222, other: 209546, total_consumption: 1599367, co2_emission: 38903},
                {aacc: "Madrid, Comunidad de", year: 2021, electricity: 477683, gas: 163788, other: 53155, total_consumption: 694626, co2_emission: 1008},
                {aacc: "Andalucía", year: 2021, electricity: 543877, gas: 174503, other: 84090, total_consumption: 802470, co2_emission: 18047}
            ];
            console.log(annual_consumptions);
            res.status(201).json(annual_consumptions);
        }
    });


    //GET
    app.get(BASE_API + "/annual-consumptions", (req, res) => {
        console.log("New GET to /annual-consumptions");
        res.send(JSON.stringify(annual_consumptions));
    });

    app.get(BASE_API + "/annual-consumptions" + "/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New GET to /annual-consumptions/${aacc}`);

        const search = annual_consumptions.filter(data => data.aacc === aacc);
        if (search.length > 0) {
            return res.status(200).json(search);
        }
        else {
            return res.status(404).json({ error: `No se encuentran datos de ${aacc}` });
        }
    });

    //POST
    app.post(BASE_API + "/annual-consumptions", (req, res) => {
        console.log("New POST to /annual-consumptions");
        let newData = req.body;

        if (!newData.aacc || !newData.year || !newData.electricity || !newData.gas || !newData.other || !newData.total_consumption || !newData.co2_emission) {
            return res.status(400).json({ error: "Faltan campos requeridos en el cuerpo de la solicitud" });
        }
        if (annual_consumptions.some(data => data.year === newData.year && data.aacc === newData.aacc)){
            return res.status(409).json({ error: "Ya existe" });
        }
        else {
            annual_consumptions.push(newData);
            res.sendStatus(201);
        }
    });

    app.post(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        console.log("New POST to /annual-consumptions");
        res.sendStatus(405).json({error : "método POST no permitido"});
    });

    //PUT
    app.put(BASE_API + "/annual-consumptions", (req, res) => {
        console.log("New PUT to /annual-consumptions");
        res.sendStatus(405).json({error : "método PUT no permitido"});
    });

    app.put(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        let aacc = req.params.aacc;
        let updatedData = req.body;

        if (updatedData.aacc !== aacc) {
            return res.status(400).json({ error: "El 'aacc' del cuerpo no coincide con el de la URL" });
        }
        else {
            console.log(`New PUT to /annual-consumptions/${aacc}`);

            const index = annual_consumptions.findIndex(data => data.aacc === aacc && data.year === req.body.year);
            if (index >= 0) {
                let updatedData = req.body; 
                annual_consumptions[index] = {
                    ...annual_consumptions[index], 
                    ...updatedData                  
                };
                res.status(200).json({message: "Datos actualizados"});
            }
            else {
                return res.status(404).json({error: `No se encuentran datos de ${aacc}`});
            }
        }
    });

    //DELETE
    app.delete(BASE_API + "/annual-consumptions", (req, res) => {
        console.log("New DELETE to /annual-consumptions");
        annual_consumptions = [];
        res.sendStatus(200).json({ message: "Datos eliminados correctamente" } + annual_consumptions);
    });

    app.delete(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New DELETE to /annual-consumptions/${aacc}`);

        const exists = annual_consumptions.some(data => data.aacc === aacc);
        if (exists) {
            annual_consumptions = annual_consumptions.filter(data => data.aacc !== aacc);
            return res.status(200).json(annual_consumptions);
        }
        else {
            return res.status(404).json({ error: `No se encuentran datos de ${aacc}` });
        }
    });
}
export {loadBackend};