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
    {"year": 2018, "technology": "Cogeneración", "subsidized_energy": 25935.3492, "total_compensation": 2713723.05, "investment_compensation": 81485.92, "operation_compensation": 1127022.62, "specific_compensation": 1208508.54, "aacc": "Asturias, Principado de"},
    {"year": 2018, "technology": "Eólica", "subsidized_energy": 36213.6612, "total_compensation": 4014360.65, "investment_compensation": 1433627.02, "operation_compensation": 0.0, "specific_compensation": 1433627.02, "aacc": "Asturias, Principado de"},
    {"year": 2018, "technology": "Hidráulica", "subsidized_energy": 2944.6433, "total_compensation": 461224.86, "investment_compensation": 95008.66, "operation_compensation": 2077.62, "specific_compensation": 97086.28, "aacc": "Galicia"},
    {"year": 2018, "technology": "Otras tecn. renovables", "subsidized_energy": 0.2602, "total_compensation": 198.09, "investment_compensation": 151.2, "operation_compensation": 34.01, "specific_compensation": 185.2, "aacc": "Asturias, Principado de"},
    {"year": 2018, "technology": "Residuos", "subsidized_energy": 2675.2138, "total_compensation": 268155.49, "investment_compensation": 76828.58, "operation_compensation": 26072.29, "specific_compensation": 102900.87, "aacc": "Cataluña"},
    {"year": 2018, "technology": "Solar FV", "subsidized_energy": 7709.1884, "total_compensation": 2925294.59, "investment_compensation": 2290619.34, "operation_compensation": 178544.59, "specific_compensation": 2469163.93, "aacc": "País Vasco"},
    {"year": 2018, "technology": "Solar TE", "subsidized_energy": 4424.1117, "total_compensation": 1538735.55, "investment_compensation": 1084136.18, "operation_compensation": 194638.56, "specific_compensation": 1278774.75, "aacc": "Andalucía"},
    {"year": 2018, "technology": "Trat.residuos", "subsidized_energy": 2582.1007, "total_compensation": 324364.94, "investment_compensation": 7888.03, "operation_compensation": 167514.61, "specific_compensation": 175402.64, "aacc": "Asturias, Principado de"},
    {"year": 2019, "technology": "Biomasa", "subsidized_energy": 3945.1373, "total_compensation": 522080.9, "investment_compensation": 150930.07, "operation_compensation": 179178.59, "specific_compensation": 330108.66, "aacc": "Galicia"},
    {"year": 2019, "technology": "Cogeneración", "subsidized_energy": 26085.9709, "total_compensation": 2486781.04, "investment_compensation": 81189.91, "operation_compensation": 1146067.56, "specific_compensation": 1227257.47, "aacc": "Galicia"},
    {"year": 2019, "technology": "Eólica", "subsidized_energy": 39045.0526, "total_compensation": 3846902.3, "investment_compensation": 1436998.76, "operation_compensation": 0.0, "specific_compensation": 1436998.76, "aacc": "Murcia, Región de"},
    {"year": 2019, "technology": "Hidráulica", "subsidized_energy": 2193.7693, "total_compensation": 332526.95, "investment_compensation": 79332.35, "operation_compensation": 872.09, "specific_compensation": 80204.45, "aacc": "Andalucía"},
    {"year": 2019, "technology": "Otras tecn. renovables", "subsidized_energy": 18.7948, "total_compensation": 1934.8, "investment_compensation": 1076.29, "operation_compensation": 25.72, "specific_compensation": 1102.01, "aacc": "Murcia, Región de"},
    {"year": 2019, "technology": "Residuos", "subsidized_energy": 2491.3602, "total_compensation": 230725.31, "investment_compensation": 76686.17, "operation_compensation": 23220.2, "specific_compensation": 99906.37, "aacc": "Murcia, Región de"},
    {"year": 2019, "technology": "Solar FV", "subsidized_energy": 8156.5887, "total_compensation": 2903506.21, "investment_compensation": 2298037.89, "operation_compensation": 166794.52, "specific_compensation": 2464832.41, "aacc": "Asturias, Principado de"},
    {"year": 2019, "technology": "Solar TE", "subsidized_energy": 5163.2534, "total_compensation": 1534194.39, "investment_compensation": 1080517.33, "operation_compensation": 205081.08, "specific_compensation": 1285598.41, "aacc": "País Vasco"},
    {"year": 2019, "technology": "Trat.residuos", "subsidized_energy": 3070.7963, "total_compensation": 372688.79, "investment_compensation": 9594.83, "operation_compensation": 214862.92, "specific_compensation": 224457.75, "aacc": "Cataluña"},
    {"year": 2020, "technology": "Biomasa", "subsidized_energy": 4513.8461, "total_compensation": 516448.91, "investment_compensation": 138877.79, "operation_compensation": 209332.93, "specific_compensation": 348210.73, "aacc": "País Vasco"},
    {"year": 2020, "technology": "Cogeneración", "subsidized_energy": 22972.9228, "total_compensation": 1570090.11, "investment_compensation": 43972.02, "operation_compensation": 728110.26, "specific_compensation": 772082.29, "aacc": "Asturias, Principado de"},
    {"year": 2020, "technology": "Eólica", "subsidized_energy": 34853.0487, "total_compensation": 2954950.24, "investment_compensation": 1219052.0, "operation_compensation": 0.0, "specific_compensation": 1219052.0, "aacc": "Cataluña"},
    {"year": 2020, "technology": "Hidráulica", "subsidized_energy": 2317.7728, "total_compensation": 271631.53, "investment_compensation": 68103.99, "operation_compensation": 0.0, "specific_compensation": 68103.99, "aacc": "País Vasco"},
    {"year": 2020, "technology": "Otras tecn. renovables", "subsidized_energy": 25.6282, "total_compensation": 2028.26, "investment_compensation": 1135.7, "operation_compensation": 35.05, "specific_compensation": 1170.75, "aacc": "País Vasco"},
    {"year": 2020, "technology": "Residuos", "subsidized_energy": 1923.0426, "total_compensation": 157826.58, "investment_compensation": 72693.2, "operation_compensation": 6546.6, "specific_compensation": 79239.8, "aacc": "Murcia, Región de"},
    {"year": 2020, "technology": "Solar FV", "subsidized_energy": 7626.8252, "total_compensation": 2896766.22, "investment_compensation": 2269162.13, "operation_compensation": 135024.27, "specific_compensation": 2404186.39, "aacc": "Cataluña"},
    {"year": 2020, "technology": "Solar TE", "subsidized_energy": 4542.6826, "total_compensation": 1380340.54, "investment_compensation": 1061869.62, "operation_compensation": 171151.73, "specific_compensation": 1233021.35, "aacc": "Galicia"},
    {"year": 2020, "technology": "Trat.residuos", "subsidized_energy": 3721.8749, "total_compensation": 344287.42, "investment_compensation": 4356.07, "operation_compensation": 210845.58, "specific_compensation": 215201.65, "aacc": "Andalucía"},
    {"year": 2021, "technology": "Biomasa", "subsidized_energy": 4781.4013, "total_compensation": 912401.42, "investment_compensation": 135884.35, "operation_compensation": 203294.82, "specific_compensation": 315943.06, "aacc": "Asturias, Principado de"},
    {"year": 2021, "technology": "Cogeneración", "subsidized_energy": 21731.5437, "total_compensation": 3170980.01, "investment_compensation": 43582.34, "operation_compensation": 652831.56, "specific_compensation": 629811.61, "aacc": "Asturias, Principado de"},
    {"year": 2021, "technology": "Eólica", "subsidized_energy": 33484.4069, "total_compensation": 7343186.04, "investment_compensation": 1218303.88, "operation_compensation": 0.0, "specific_compensation": 1126636.1, "aacc": "Murcia, Región de"},
    {"year": 2021, "technology": "Hidráulica", "subsidized_energy": 1844.2187, "total_compensation": 565675.81, "investment_compensation": 67937.71, "operation_compensation": 0.0, "specific_compensation": 63313.92, "aacc": "Asturias, Principado de"},
    {"year": 2021, "technology": "Otras tecn. renovables", "subsidized_energy": 17.7831, "total_compensation": 3105.35, "investment_compensation": 1135.7, "operation_compensation": 38.94, "specific_compensation": 1094.79, "aacc": "Andalucía"},
    {"year": 2021, "technology": "Residuos", "subsidized_energy": 1820.3537, "total_compensation": 372347.51, "investment_compensation": 67491.65, "operation_compensation": 9364.61, "specific_compensation": 69954.98, "aacc": "País Vasco"},
    {"year": 2021, "technology": "Solar FV", "subsidized_energy": 7570.0251, "total_compensation": 4374819.65, "investment_compensation": 2267951.39, "operation_compensation": 157349.28, "specific_compensation": 2326340.04, "aacc": "Asturias, Principado de"},
    {"year": 2021, "technology": "Solar TE", "subsidized_energy": 4705.1845, "total_compensation": 1678529.69, "investment_compensation": 1062428.87, "operation_compensation": 193307.97, "specific_compensation": 1201047.57, "aacc": "Galicia"},
    {"year": 2021, "technology": "Trat.residuos", "subsidized_energy": 3687.7787, "total_compensation": 615624.33, "investment_compensation": 4342.29, "operation_compensation": 206323.11, "specific_compensation": 195392.62, "aacc": "Galicia"},
    {"year": 2022, "technology": "Biomasa", "subsidized_energy": 2369.1034, "total_compensation": 943094.3, "investment_compensation": 95151.06, "operation_compensation": 0.0, "specific_compensation": 56179.63, "aacc": "Asturias, Principado de"},
    {"year": 2022, "technology": "Cogeneración", "subsidized_energy": 11787.4938, "total_compensation": 3279457.66, "investment_compensation": 10903.02, "operation_compensation": 577634.32, "specific_compensation": 439248.12, "aacc": "Andalucía"},
    {"year": 2022, "technology": "Eólica", "subsidized_energy": 17810.599, "total_compensation": 10119064.43, "investment_compensation": 540803.55, "operation_compensation": 0.0, "specific_compensation": 356287.02, "aacc": "Andalucía"},
    {"year": 2022, "technology": "Hidráulica", "subsidized_energy": 768.5767, "total_compensation": 747744.89, "investment_compensation": 34487.85, "operation_compensation": 0.0, "specific_compensation": 23963.42, "aacc": "País Vasco"},
    {"year": 2022, "technology": "Otras tecn. renovables", "subsidized_energy": 21.3516, "total_compensation": 3897.85, "investment_compensation": 514.74, "operation_compensation": 14.79, "specific_compensation": 289.44, "aacc": "Murcia, Región de"},
    {"year": 2022, "technology": "Residuos", "subsidized_energy": 900.2582, "total_compensation": 436562.69, "investment_compensation": 28309.25, "operation_compensation": 0.0, "specific_compensation": 17097.31, "aacc": "Andalucía"},
    {"year": 2022, "technology": "Solar FV", "subsidized_energy": 8348.5848, "total_compensation": 6298486.64, "investment_compensation": 2212344.63, "operation_compensation": 0.03, "specific_compensation": 1996432.87, "aacc": "Andalucía"},
    {"year": 2022, "technology": "Solar TE", "subsidized_energy": 4124.9634, "total_compensation": 1534662.23, "investment_compensation": 1025660.82, "operation_compensation": 1679.81, "specific_compensation": 914391.49, "aacc": "Andalucía"},
    {"year": 2022, "technology": "Trat.residuos", "subsidized_energy": 2198.2071, "total_compensation": 662521.5, "investment_compensation": 0.0, "operation_compensation": 302823.47, "specific_compensation": 257324.89, "aacc": "País Vasco"},
    {"year": 2023, "technology": "Biomasa", "subsidized_energy": 1370.4509, "total_compensation": 405858.39, "investment_compensation": 48661.54, "operation_compensation": 0.0, "specific_compensation": 48661.54, "aacc": "Murcia, Región de"},
    {"year": 2023, "technology": "Cogeneración", "subsidized_energy": 13132.3323, "total_compensation": 2032501.82, "investment_compensation": 2205.6, "operation_compensation": 720125.32, "specific_compensation": 722330.91, "aacc": "Cataluña"},
    {"year": 2023, "technology": "Eólica", "subsidized_energy": 147.1519, "total_compensation": 4846299.14, "investment_compensation": 584.6, "operation_compensation": 0.0, "specific_compensation": 584.6, "aacc": "Galicia"},
    {"year": 2023, "technology": "Hidráulica", "subsidized_energy": 105.136, "total_compensation": 405378.68, "investment_compensation": 1024.6, "operation_compensation": 0.0, "specific_compensation": 1024.6, "aacc": "Andalucía"},
    {"year": 2023, "technology": "Otras tecn. renovables", "subsidized_energy": 0.2667, "total_compensation": 1106.4, "investment_compensation": 142.24, "operation_compensation": 11.94, "specific_compensation": 154.18, "aacc": "Galicia"},
    {"year": 2023, "technology": "Residuos", "subsidized_energy": 0.0, "total_compensation": 192000.72, "investment_compensation": 4851.88, "operation_compensation": 0.0, "specific_compensation": 4851.88, "aacc": "Murcia, Región de"},
    {"year": 2023, "technology": "Solar FV", "subsidized_energy": 7533.5654, "total_compensation": 4872156.12, "investment_compensation": 2121403.13, "operation_compensation": 0.0, "specific_compensation": 2121402.78, "aacc": "Galicia"},
    {"year": 2023, "technology": "Solar TE", "subsidized_energy": 4699.088, "total_compensation": 1359957.83, "investment_compensation": 1006955.82, "operation_compensation": 476.43, "specific_compensation": 1007432.25, "aacc": "Murcia, Región de"},
    {"year": 2023, "technology": "Trat.residuos", "subsidized_energy": 3355.3668, "total_compensation": 942603.99, "investment_compensation": 0.0, "operation_compensation": 625540.95, "specific_compensation": 625540.95, "aacc": "Cataluña"},
    {"year": 2024, "technology": "Biomasa", "subsidized_energy": 1360.2299, "total_compensation": 320979.87, "investment_compensation": 32167.11, "operation_compensation": 97879.95, "specific_compensation": 130047.06, "aacc": "Asturias, Principado de"},
    {"year": 2024, "technology": "Cogeneración", "subsidized_energy": 8076.9782, "total_compensation": 1115426.86, "investment_compensation": 1294.24, "operation_compensation": 479792.73, "specific_compensation": 481086.96, "aacc": "Galicia"},
    {"year": 2024, "technology": "Eólica", "subsidized_energy": 107.4349, "total_compensation": 1817502.91, "investment_compensation": 394.29, "operation_compensation": 0.0, "specific_compensation": 394.29, "aacc": "Murcia, Región de"},
    {"year": 2024, "technology": "Hidráulica", "subsidized_energy": 92.073, "total_compensation": 192874.99, "investment_compensation": 686.11, "operation_compensation": 0.0, "specific_compensation": 686.11, "aacc": "País Vasco"},
    {"year": 2024, "technology": "Otras tecn. renovables", "subsidized_energy": 0.1429, "total_compensation": 309.19, "investment_compensation": 94.83, "operation_compensation": 10.95, "specific_compensation": 105.77, "aacc": "Andalucía"},
    {"year": 2024, "technology": "Residuos", "subsidized_energy": 0.0, "total_compensation": 73773.29, "investment_compensation": 3234.58, "operation_compensation": 0.0, "specific_compensation": 3234.58, "aacc": "Murcia, Región de"},
    {"year": 2024, "technology": "Solar FV", "subsidized_energy": 5236.5757, "total_compensation": 2576824.54, "investment_compensation": 1408778.11, "operation_compensation": 0.0, "specific_compensation": 1408778.11, "aacc": "País Vasco"},
    {"year": 2024, "technology": "Solar TE", "subsidized_energy": 3306.5587, "total_compensation": 800742.22, "investment_compensation": 671303.88, "operation_compensation": 4417.35, "specific_compensation": 675721.23, "aacc": "Asturias, Principado de"},
    {"year": 2024, "technology": "Trat.residuos", "subsidized_energy": 2228.2321, "total_compensation": 414504.61, "investment_compensation": 0.0, "operation_compensation": 283316.6, "specific_compensation": 283316.6, "aacc": "Cataluña"}
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
