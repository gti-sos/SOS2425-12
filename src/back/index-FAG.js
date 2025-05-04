import datastore from "nedb";
const BASE_API = "/api/v1";
let db = new datastore();

let initial_annual_retributions = [
    {"year": 2017, "technology": "Biomasa", "subsidized_energy": 3984.8567, "total_compensation": 536521.12, "investment_compensation": 148150.2, "operation_compensation": 178340.4, "specific_compensation": 326490.61, "aacc": "Murcia, Región de"},
    {"year": 2017, "technology": "Cogeneración", "subsidized_energy": 25262.1421, "total_compensation": 2506572.04, "investment_compensation": 81583.52, "operation_compensation": 1084262.51, "specific_compensation": 1165846.03, "aacc": "Murcia, Región de"},
    {"year": 2017, "technology": "Eólica", "subsidized_energy": 35149.794, "total_compensation": 3860554.53, "investment_compensation": 1472879.98, "operation_compensation": 0.0, "specific_compensation": 1472879.98, "aacc": "Asturias, Principado de"},
    {"year": 2017, "technology": "Hidráulica", "subsidized_energy": 1698.0004, "total_compensation": 287182.82, "investment_compensation": 83230.89, "operation_compensation": 1063.44, "specific_compensation": 84294.33, "aacc": "Cataluña"},
    {"year": 2017, "technology": "Otras tecn. renovables", "subsidized_energy": 0.2328, "total_compensation": 193.46, "investment_compensation": 151.2, "operation_compensation": 31.22, "specific_compensation": 182.42, "aacc": "Murcia, Región de"},
    {"year": 2017, "technology": "Residuos", "subsidized_energy": 2813.9292, "total_compensation": 265275.15, "investment_compensation": 78490.99, "operation_compensation": 26614.72, "specific_compensation": 105105.72, "aacc": "Cataluña"},
    {"year": 2017, "technology": "Solar FV", "subsidized_energy": 8339.3808, "total_compensation": 2932739.57, "investment_compensation": 2299769.37, "operation_compensation": 202919.64, "specific_compensation": 2502689.02, "aacc": "Asturias, Principado de"},
    {"year": 2017, "technology": "Solar TE", "subsidized_energy": 5347.6972, "total_compensation": 1594779.26, "investment_compensation": 1085765.22, "operation_compensation": 234998.04, "specific_compensation": 1320763.25, "aacc": "Cataluña"},
    {"year": 2017, "technology": "Trat.residuos", "subsidized_energy": 2419.3571, "total_compensation": 292381.6, "investment_compensation": 12428.54, "operation_compensation": 152417.83, "specific_compensation": 164846.37, "aacc": "Asturias, Principado de"},
    {"year": 2018, "technology": "Biomasa", "subsidized_energy": 3951.7731, "total_compensation": 554749.98, "investment_compensation": 148533.7, "operation_compensation": 176419.89, "specific_compensation": 324953.59, "aacc": "Cataluña"},
    {"year": 2018, "technology": "Cogeneración", "subsidized_energy": 25935.3492, "total_compensation": 2713723.05, "investment_compensation": 81485.92, "operation_compensation": 1127022.62, "specific_compensation": 1208508.54, "aacc": "Asturias, Principado de"}
    ];

db.find({},(err,data)=>{
    if (data.length < 1){
        db.insert(initial_annual_retributions);
    }
});

function loadBackendFAG(app){

    //docs
    app.get(BASE_API + "/annual-retributions/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42233131/2sB2cUC3np");
    });

    //loadInitialData
    app.get(BASE_API + "/annual-retributions/loadInitialData", (req, res) => {
        console.log("New GET to /loadInitialData");
        db.find({},(err,data)=>{
            if (data.length > 0){
                return res.status(409).json({ message: "El array ya contiene datos" });
            } else {
                db.insert(initial_annual_retributions);
                res.sendStatus(201);
            }
        });
    });

    //GET
    app.get(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New GET to /annual-retributions");

        const limit = parseInt(req.query.limit) || 999999;
        const offset = parseInt(req.query.offset) || 0;

        let query = {};
        const filterableFields = ["year", "technology", "subsidized_energy", "total_compensation", "investment_compensation", "operation_compensation", "specific_compensation", "aacc"];
        
        filterableFields.forEach(field => {
            if (req.query[field]) {
                const value = req.query[field];
                query[field] = isNaN(value) ? value : Number(value);
            }
        });

        if (req.query.from || req.query.to) {
            query.year = {};
            if (req.query.from) query.year.$gte = Number(req.query.from);
            if (req.query.to) query.year.$lte = Number(req.query.to);
        }
        
        db.find(query).skip(offset).limit(limit).exec((err, annual_retributions) => {
            res.send(JSON.stringify(annual_retributions.map((x) => {
                delete x._id;
                return x;
            }), null, 2));
        });
    });

    app.get(BASE_API + "/annual-retributions" + "/:technology", (req, res) => {
        const technology = req.params.technology;
        console.log(`New GET to /annual-retributions/${technology}`);

        db.find({}, (err, annual_retributions) => {
            const search = annual_retributions.filter(x => x.technology === technology);
            if (search.length > 0) {
                res.send(JSON.stringify(search.map((x) => {
                    delete x._id;
                    return x;
                }), null, 2))
                res.status(200);
            } else {
                return res.status(404).json({ error: `No se encuentran datos de ${technology}` });
            }
        });
    });

    app.get(BASE_API + "/annual-retributions" + "/:technology" + "/:year", (req, res) => {
        const technology = req.params.technology;
        const year = parseInt(req.params.year);
        console.log(`New GET to /annual-retributions/${technology}/${year}`);

        db.find({}, (err, annual_retributions) => {
            const search = annual_retributions.filter(x => x.technology === technology && x.year === year);
            if (search.length > 0) {
                res.send(JSON.stringify(search.map((x) => {
                    delete x._id;
                    return x;
                })[0], null, 2));
                res.status(200);
            } else {
                return res.status(404).json({ error: `No se encuentran datos de ${technology} en el año ${year}`})
            }
        });
    });

    //POST

    app.post(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New POST to /annual-retributions");
        let newData = req.body;
        db.find({}, (err, annual_retributions) => {
            if (annual_retributions.some(x =>  x.year === newData.year && x.technology === newData.technology)){
                return res.status(409).json({ error: "Ya existe ese dato" });
            }
            else{
                if (!newData.year || !newData.aacc || !newData.technology || !newData.subsidized_energy
                    || !newData.total_compensation || !newData.investment_compensation
                    || !newData.operation_compensation || !newData.specific_compensation) {
                    return res.status(400).json({ error: "Faltan datos requeridos" });
                }
                else{
                    db.insert(newData);
                    res.sendStatus(201);
                }
            }
        })
    });


    app.post(BASE_API + "/annual-retributions" + "/:technology" + "/:year", (req, res) => {
        const technology = req.params.technology;
        const year = parseInt(req.params.year);
        console.log(`New POST to /annual-retributions/${technology}/${year}`);
        res.status(405).json({error : "Método POST no permitido"});
    });

    app.post(BASE_API + "/annual-retributions" + "/:technology", (req, res) => {
        const technology = req.params.technology;
        console.log(`New POST to /annual-retributions/${technology}`);
        res.status(405).json({error : "Método POST no permitido"});
    });

    //PUT
    app.put(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New PUT to /annual-retributions");
        res.status(405).json({error : "Método PUT no permitido"});
    });

    app.put(BASE_API + "/annual-retributions" + "/:technology", (req, res) => {
        console.log("New PUT to /annual-retributions");
        res.status(405).json({error : "Método PUT no permitido"});
    });

    app.put(BASE_API + "/annual-retributions" + "/:technology" + "/:year", (req, res) => {
        const technology = req.params.technology;
        const year = parseInt(req.params.year);
        const data = req.body;

        console.log(`New PUT to /annual-retributions/${technology}/${year}`);

        if (!data.year || !data.aacc || !data.technology || !data.subsidized_energy
            || !data.total_compensation || !data.investment_compensation
            || !data.operation_compensation || !data.specific_compensation) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }
        else{
            db.find({ technology: technology, year: year }, (err, object) => {
                if (object[0].year != data.year || object[0].technology != data.technology) {
                    return res.status(400).json({ error: `No se puede actualizar el id de un dato` });
                } else {
                    db.update(
                        { technology: technology, year: year },
                        { $set: data },
                        {},
                        (_err, numAffected) => {
                            if (numAffected > 0) {
                                return res.status(200).json({ message: "Datos actualizados correctamente" });
                            } else {
                                return res.status(404).json({ error: `No se encuentran datos de la tecnología ${technology} en el año ${year}` });
                            }
                        }
                    );
                }
            });    
        }
    });

    //DELETE
    app.delete(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New DELETE to /annual-retributions");
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (numRemoved > 0) {
                db.find({}, (err, emptyData) => {return res.status(200).json(emptyData)});
            } else {
                return res.status(404).json({ error: "No se encuentran datos" });
            }
        }
        );
    });

    app.delete(BASE_API + "/annual-retributions" + "/:technology", (req, res) => {
        const technology = req.params.technology;
        console.log(`New DELETE to /annual-retributions/${technology}`);

        db.remove({ technology: technology }, { multi: true }, (err, numRemoved) => {
            if (numRemoved > 0) {
                return res.sendStatus(200);
            } else {
                return res.status(404).json({ error: `No se encuentran datos de ${technology}` });
            }
        }
        );

    });


    app.delete(BASE_API + "/annual-retributions" + "/:technology" + "/:year", (req, res) => {
        const technology = req.params.technology.trim();
        const year = parseInt(req.params.year);
        console.log(`New DELETE to /annual-retributions/${technology}/${year}`);

        db.remove({ technology: technology, year: year }, (err, numRemoved) => {
            if (numRemoved > 0) {
                return res.sendStatus(200);
            } else {
                return res.status(404).json({ error: `No se encuentran datos de la tecnología ${technology} en el año ${year}` });
            }
        }
        );

    });
}

export { loadBackendFAG };
