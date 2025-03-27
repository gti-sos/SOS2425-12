const BASE_API = "/api/v1";

let annual_retributions = [
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
];

function loadBackendFAG(app){

    //loadInitialData
    app.get(BASE_API + "/annual-retributions/loadInitialData", (req, res) => {
        console.log("New GET to /loadInitialData");
        if (annual_retributions.length > 0) {
            return res.status(400).json({ message: "El array ya contiene datos" });
        }
        else{
            console.log(annual_retributions);

            res.status(201).json(annual_retributions);
        }
    });

    //GET
    app.get(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New GET to /annual-retributions");
        res.send(JSON.stringify(annual_retributions));
    });

    app.get(BASE_API + "/annual-retributions" + "/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New GET to /annual-retributions/${aacc}`);

        const search = annual_retributions.filter(x => x.aacc === aacc);
        if (search.length > 0){
            return res.status(200).json(search);
        }
        else{   
            return res.status(404).json({error: `No se encuentran datos de ${aacc}`});
        }
    });

    app.get(BASE_API + "/annual-retributions" + "/:aacc" + "/:year", (req, res) => {
        const aacc = req.params.aacc;
        const year = req.params.year;
        console.log(`New GET to /annual-retributions/${aacc}`);

        const search = annual_retributions.filter(x => (x.aacc === aacc) & (x.year == year));
        if (search.length > 0){
            return res.status(200).json(search);
        }
        else{   
            return res.status(404).json({error: `No se encuentran datos de ${aacc}`});
        }
    });

    //POST

    app.post(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New POST to /annual-retributions");
        let newData = req.body;
        if (annual_retributions.some(x =>  x.year === newData.year && x.aacc === newData.aacc && x.technology === newData.technology)){
            return res.status(409).json({ error: "Ya existe ese dato" });
        }
        else{
            if (!newData.year || !newData.aacc || !newData.technology || !newData.subsidized_energy || !newData.total_compensation || !newData.investment_compensation || !newData.operation_compensation || !newData.specific_compensation) {
                return res.status(400).json({ error: "Faltan datos requeridos" });
            }
            else{
                annual_retributions.push(newData);
                res.sendStatus(201);
            }
        }
    });


    app.post(BASE_API + "/annual-retributions/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New POST to /annual-retributions/${aacc}`);
        res.status(405).json({error : "Método POST no permitido"});
    });

    //PUT
    app.put(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New PUT to /annual-retributions");
        res.status(405).json({error : "Método PUT no permitido"});
    });


    app.put(BASE_API + "/annual-retributions/:aacc", (req, res) => {
        let aacc = req.params.aacc;
        console.log(`New PUT to /annual-retributions/${aacc}`);
        if (!req.body.aacc || aacc == req.body.aacc){
            const index = annual_retributions.findIndex(x => x.aacc == aacc);
            if (index >= 0){
                let data = req.body;
                annual_retributions[index] = {
                    ...annual_retributions[index],
                    ...data
                };
                res.status(200).json({message : "Datos actualizados"});
                
            }
            else{   
                return res.status(404).json({error: `No se encuentran datos de ${aacc}`});
            }
        } else {
            return res.status(400).json({error: "No se puede modificar el id"});
        }
    });

    //DELETE
    app.delete(BASE_API + "/annual-retributions", (req, res) => {
        console.log("New DELETE to /annual-retributions");
        annual_retributions = [];
        res.status(200).json(annual_retributions);
    });


    app.delete(BASE_API + "/annual-retributions" + "/:aacc", (req, res) => {
        const aacc = req.params.aacc;
        console.log(`New GET to /annual-retributions/${aacc}`);

        const exists = annual_retributions.some(x => x.aacc === aacc);
        if (exists){
            annual_retributions = annual_retributions.filter(x => x.aacc !== aacc);
            return res.status(200).json(annual_retributions);
        }
        else{   
            return res.status(404).json({error: `No se encuentran datos de ${aacc}`});
        }
    });
}

export { loadBackendFAG };