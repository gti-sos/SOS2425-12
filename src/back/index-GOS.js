import dataStore from "nedb";
const BASE_API = "/api/v1";
let db = new dataStore();

let initialData = [
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

function loadBackendGOS(app){
    //https://sos2425-12.onrender.com/api/v1/annual-consumptions/docs
    app.get("/api/v1/annual-consumptions/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42146733/2sB2cUB3aK");
    });

    app.get(BASE_API + "/annual-consumptions/loadInitialData", (_req, res) => {
        db.find({}, (_err, annual_consumptions) => {
            if (annual_consumptions.length < 1) {
                db.insert(initialData);
                res.status(201).json({ message: "Datos iniciales cargados correctamente" });
            } else {
                res.status(409).json({ error: "La base de datos ya contiene datos" });
            }
        });
    });

    //GET
    app.get(BASE_API + "/annual-consumptions", (req, res) => {
        console.log("New GET to /annual-consumptions with query", req.query);
        let query = {};
        if (req.query.from || req.query.to) {
            query.year = {};
            if (req.query.from) query.year.$gte = Number(req.query.from);
            if (req.query.to) query.year.$lte = Number(req.query.to);
        }
    
        const filterableFields = ["aacc", "electricity", "gas", "other", "total_consumption", "co2_emission"];
        filterableFields.forEach(field => {
            if (req.query[field]) {
                const value = req.query[field];
                query[field] = isNaN(value) ? value : Number(value);
            }
        });
    
        db.find(query, (err, results) => {
            if (err) {
                console.error("Error accessing the database:", err);
                return res.status(500).json({ error: "Error accessing the database" });
            }
    
            res.status(200).json(results.map((c) => {
                delete c._id;
                return c;
            }));
        });
    });

    app.get(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New GET to /annual-consumptions/${aacc}`);

        db.find({ aacc: aacc }, (err, search) => {
            if (err) {
                console.error("Error accessing the database:", err);
                return res.status(500).json({ error: "Error accessing the database" });
            }
            if (search.length > 0) {
                res.status(200).json(search.map((c) => {
                    delete c._id;
                    return c;
                }));
            } else {
                res.status(404).json({ error: `No se encuentran datos de ${aacc}` });
            }
        });
    });

    app.get(BASE_API + "/annual-consumptions/:aacc/:year", (req, res) => {
        const { aacc, year } = req.params;
    
        db.find({ aacc: aacc, year: Number(year) }, (err, data) => {
            if (err) {
                console.error("Error al acceder a la base de datos:", err);
                return res.status(500).json({ error: "Error al acceder a la base de datos" });
            }
    
            if (data.length === 1) {
                let item = data[0];
                delete item._id;
                res.status(200).json(item);
            } else {
                res.status(404).json({ error: `No se encuentran datos de ${aacc} en ${year}` });
            }
        });
    });
    

    //POST
    app.post(BASE_API + "/annual-consumptions", (req, res) => {

        if (Object.hasOwn(req.body, "_id")) {
            return res.status(400).json({ error: "No se permite enviar la propiedad _id" });
        }
        else {
            console.log("New POST to /annual-consumptions");
            const newData = req.body;
            const requiredFields = ["aacc", "year", "electricity", "gas", "other", "total_consumption", "co2_emission"];
        
            const hasAllFields = requiredFields.every(field => Object.hasOwn(newData, field));
        
            const hasOnlyFields = Object.keys(newData).every(key => requiredFields.includes(key));
        
            const validTypes = typeof newData.aacc === "string"
                && typeof newData.year === "number"
                && typeof newData.electricity === "number"
                && typeof newData.gas === "number"
                && typeof newData.other === "number"
                && typeof newData.total_consumption === "number"
                && typeof newData.co2_emission === "number";
        
            if (!hasAllFields || !hasOnlyFields || !validTypes) {
                return res.status(400).json({ error: "La estructura del JSON recibido no es válida" });
            }
        
            db.find({ year: newData.year, aacc: newData.aacc }, (_err, existingData) => {
                if (existingData.length > 0) {
                    return res.status(409).json({ error: "Ya existe un recurso con ese año y comunidad" });
                } else {
                    db.insert(newData);
                    res.status(201).json({ message: "Recurso creado correctamente" });
                    ;
                }
            });
        }
    });
    

    app.post(BASE_API + "/annual-consumptions/:aacc", (_req, res) => {
        console.log("New POST to /annual-consumptions");
        res.sendStatus(405).json({error : "método POST no permitido"});
    });

    //PUT
    app.put(BASE_API + "/annual-consumptions", (_req, res) => {
        console.log("New PUT to /annual-consumptions");
        res.sendStatus(405).json({error : "método PUT no permitido"});
    });

    app.put(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        let aacc = req.params.aacc;
        let updatedData = req.body;
        if (Object.hasOwn(req.body, "_id")) {
            return res.status(400).json({ error: "No se permite enviar la propiedad _id" });
        }
        else {
            if (updatedData.aacc !== aacc) {
                return res.status(400).json({ error: "El 'aacc' del cuerpo no coincide con el de la URL" });
            } else {
                console.log(`New PUT to /annual-consumptions/${aacc}`);

                db.update(
                    { aacc: aacc, year: updatedData.year },
                    { $set: updatedData },
                    {},
                    (err, numReplaced) => {
                        if (err) {
                            console.error("Error updating the database:", err);
                            return res.status(500).json({ error: "Error updating the database" });
                        }
                        if (numReplaced > 0) {
                            res.status(200).json({ message: "Datos actualizados correctamente" });
                        } else {
                            res.status(404).json({ error: `No se encuentran datos de ${aacc}` });
                        }
                    }
                );
            }
        }
    });

    app.put(BASE_API + "/annual-consumptions/:aacc/:year", (req, res) => {
        const { aacc, year } = req.params;
        const updatedData = req.body;
        const requiredFields = ["aacc", "year", "electricity", "gas", "other", "total_consumption", "co2_emission"];
        if (Object.hasOwn(req.body, "_id")) {
            return res.status(400).json({ error: "No se permite enviar la propiedad _id" });
        }
        else {
            if (updatedData.aacc !== aacc || Number(updatedData.year) !== Number(year)) {
                return res.status(400).json({ error: "El 'aacc' y 'year' del cuerpo no coinciden con la URL" });
            }
        
            const hasAllFields = requiredFields.every(field => Object.hasOwn(updatedData, field));
            const hasOnlyFields = Object.keys(updatedData).every(key => requiredFields.includes(key));
            const validTypes = typeof updatedData.aacc === "string"
                && typeof updatedData.year === "number"
                && typeof updatedData.electricity === "number"
                && typeof updatedData.gas === "number"
                && typeof updatedData.other === "number"
                && typeof updatedData.total_consumption === "number"
                && typeof updatedData.co2_emission === "number";
        
            if (!hasAllFields || !hasOnlyFields || !validTypes) {
                return res.status(400).json({ error: "La estructura del JSON recibido no es válida" });
            }
        
            db.update({ aacc: aacc, year: Number(year) }, { $set: updatedData }, {}, (err, numReplaced) => {
                if (err) {
                    console.error("Error actualizando la base de datos:", err);
                    return res.status(500).json({ error: "Error actualizando la base de datos" });
                }
                if (numReplaced > 0) {
                    res.status(200).json({ message: "Datos actualizados correctamente" });
                } else {
                    res.status(404).json({ error: `No se encuentran datos de ${aacc} en ${year}` });
                }
            });
        }
    });
    

    //DELETE
    app.delete(BASE_API + "/annual-consumptions", (_req, res) => {
        console.log("New DELETE to /annual-consumptions");

        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error("Error deleting the database:", err);
                return res.status(500).json({ error: "Error deleting the database" });
            }
            res.status(200).json({ message: `Datos eliminados correctamente (${numRemoved} registros eliminados)` });
        });
    });

    app.delete(BASE_API + "/annual-consumptions/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New DELETE to /annual-consumptions/${aacc}`);

        db.remove({ aacc: aacc }, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error("Error deleting the database:", err);
                return res.status(500).json({ error: "Error deleting the database" });
            }
            if (numRemoved > 0) {
                res.status(200).json({ message: `Datos de ${aacc} eliminados correctamente (${numRemoved} registros eliminados)` });
            } else {
                res.status(404).json({ error: `No se encuentran datos de ${aacc}` });
            }
        });
    });

    app.delete(BASE_API + "/annual-consumptions/:aacc/:year", (req, res) => {
        const aacc = req.params.aacc;
        const year = Number(req.params.year);
        console.log(`New DELETE to /annual-consumptions/${aacc}/${year}`);
    
        db.remove({ aacc: aacc, year: year }, {}, (err, numRemoved) => {
            if (err) {
                console.error("Error deleting the database:", err);
                return res.status(500).json({ error: "Error deleting the database" });
            }
            if (numRemoved > 0) {
                res.status(200).json({ message: `Datos de ${aacc} en ${year} eliminados correctamente` });
            } else {
                res.status(404).json({ error: `No se encuentran datos de ${aacc} en ${year}` });
            }
        });
    });
}
export {loadBackendGOS};