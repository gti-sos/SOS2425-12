import dataStore from "nedb";
const BASE_API = "/api/v1";
let db = new dataStore();

let initialData = [
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



function loadBackendCRR(app){ 

    let annual_evolutions = [];

    //loadInitialData
    app.get(BASE_API + "/annual-evolutions/loadInitialData", (request, response) => {
        console.log("New GET to /loadInitialData");
        db.find({}, (_err, annual_evolutions) =>{ //busca todos los documentos en la base de datos sin aplicar filtros (por eso el {} vacío).
            if (annual_evolutions.length > 0) {
                response.status(400).json({ message: "El array ya contiene datos " });
            }
            else{
                db.insert(initialData);
                response.status(201).json(annual_evolutions);
            }
        })
    });

    //GET
    app.get(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New GET to /annual-evolutions");

        db.find({}, (_err, annual_evolutions) => {
            response.status(200);
            response.send(JSON.stringify(annual_evolutions.map((c) => {
                delete c._id;
                return c;
            }), null, 2));
            //no se aplica una función de reemplazo (null)
            //se usa una indentación de 2 espacios para hacer el JSON más legible.
        });
    });


    app.get(BASE_API + "/annual-evolutions" + "/:aacc", (request, response) => {
        const aacc = request.params.aacc;
        console.log(`New GET to /annual-evolutions/${aacc}`);

        const search = annual_evolutions.filter(x => x.aacc === aacc);
        if (search.length > 0){
            return response.status(200).json(search);
        }
        else{   
            return response.status(404).json({error: `No se encuentran datos de ${aacc}`});
        }
    });

    //POST
    app.post(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New POST to /annual-evolutions");
        let newData = request.body;
        if (annual_evolutions.some(x =>  x.year === newData.year && x.aacc === newData.aacc && x.technology === newData.technology)){
            return response.status(409).json({ error: "Ya existe ese dato" });
        }
        else{
            if (!newData.year || !newData.aacc || !newData.technology || !newData.energy_sold || !newData.installed_power || !newData.load_factor) {
                return response.status(400).json({ error: "Faltan datos requeridos" });
            }
            else{
                annual_evolutions.push(newData);
                response.sendStatus(201);
            }
        }
    });


    app.post(BASE_API + "/annual-evolutions/:aacc", (request, response) => {
        const aacc = request.params.aacc;
        console.log(`New POST to /annual-evolutions/${aacc}`);
        response.status(405).json({error : "Método POST no permitido"});
    });


    //PUT
    app.put(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New PUT to /annual-evolutions");
        response.status(405).json({error : "Método PUT no permitido"});
    });


    app.put(BASE_API + "/annual-evolutions/:aacc", (request, response) => {
        let aacc = request.params.aacc;
        console.log(`New PUT to /annual-evolutions/${aacc}`);
        if (!req.body.aacc || aacc == request.body.aacc){
            const index = annual_evolutions.findIndex(x => x.aacc == aacc);
            if (index >= 0){
                let data = request.body;
                annual_evolutions[index] = {
                    ...annual_evolutions[index], // mantiene los datos actuales
                    ...data                      // sobrescribe solo los campos enviados
                };
                response.status(200).json({message : "Datos actualizados"});
                
            }
            else{   
                return response.status(404).json({error: `No se encuentran datos de ${aacc}`});
            }
        }
        else{
            return response.status(400).json({error: "No se puede modificar el id"});
        }
    });

    //DELETE
    app.delete(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New DELETE to /annual-evolutions");
        annual_evolutions = [];
        response.status(200).json(annual_evolutions);
    });


    app.delete(BASE_API + "/annual-evolutions" + "/:aacc", (request, response) => {
        const aacc = request.params.aacc;
        console.log(`New GET to /annual-evolutions/${aacc}`);

        const exists = annual_evolutions.some(x => x.aacc === aacc);
        if (exists){
            annual_evolutions = annual_evolutions.filter(x => x.aacc !== aacc);
            return response.status(200).json(annual_evolutions);
        }
        else{   
            return response.status(404).json({error: `No se encuentran datos de ${aacc}`});
        }
    });

};

export {loadBackendCRR};