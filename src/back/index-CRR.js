import dataStore from "nedb";
const BASE_API = "/api/v1";
//let db = new dataStore();
let db = new dataStore({ inMemoryOnly: true, autoload: true });


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


    //docs
    app.get(BASE_API + "/annual-evolutions/docs", (request, response) => {
        response.redirect("https://documenter.getpostman.com/view/42121463/2sB2cShixE");
    });


    //loadInitialData
    app.get(BASE_API + "/annual-evolutions/loadInitialData", (request, response) => {
        console.log("New GET to /loadInitialData");
        db.find({}, (_err, annual_evolutions) =>{ //busca todos los documentos en la base de datos sin aplicar filtros (por eso el {} vacío).
            if (annual_evolutions.length > 0) {
                response.status(400).json({ message: "El array ya contiene datos " });
            }
            else{
                db.insert(initialData);
                console.log(`count data ${initialData.length}`)
                response.status(201).json({ message: "Datos iniciales cargados correctamente" });
                
                //console.log("datos cargados")
            }
        })
    }); 

    //GET
    app.get(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New GET to /annual-evolutions");

        let query = {}; // Filtros para buscar datos en la base de datos
        let parametrosURL = request.query;  // Por ejemplo: ?aacc=Ceuta&year=2008
        
        // Añadimos cada campo parseado a query si está presente en la URL
        if (parametrosURL.year) query.year = parseInt(parametrosURL.year);
        if (parametrosURL.aacc) query.aacc = parametrosURL.aacc;
        if (parametrosURL.technology) query.technology = parametrosURL.technology;
        if (parametrosURL.energy_sold) query.energy_sold = parseFloat(parametrosURL.energy_sold);
        if (parametrosURL.installed_power) query.installed_power = parseFloat(parametrosURL.installed_power);
        if (parametrosURL.load_factor) query.load_factor = parseFloat(parametrosURL.load_factor);
        

        //Paginación
        const limit = parseInt(request.query.limit) || 0;
        const offset = parseInt(request.query.offset) || 0;

        db.find(query).skip(offset).limit(limit).exec((_err, annual_evolutions) => {
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

       // const search = annual_evolutions.filter(x => x.aacc === aacc);
        db.find({aacc: aacc}, (_err, search) => {
            if (search.length > 0){
                response.status(200).json(search.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
            else{   
                response.status(404).json({error: `No se encuentran datos de ${aacc}`});
            }
        })
        
    });


    
    app.get(BASE_API + "/annual-evolutions" + "/:aacc/:year", (request, response) => {
        const aacc = request.params.aacc;
        const year = request.params.year;
        console.log(`New GET to /annual-evolutions/${aacc}/${year}`);

       // const search = annual_evolutions.filter(x => x.aacc === aacc);
        db.find({aacc: aacc, year : parseInt(year)}, (_err, search) => {
            if (search.length > 0){
                response.status(200).json(search.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
            else{   
                response.status(404).json({error: `No se encuentran datos de ${aacc}/${year}`});
            }
        })
        
    });



    //POST
    app.post(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New POST to /annual-evolutions");
        let newData = request.body;

        if (!newData.year || !newData.aacc || !newData.technology || !newData.energy_sold || !newData.installed_power || !newData.load_factor) {
            return response.status(400).json({ error: "Faltan datos requeridos" });
        }
        else{
            // if (annual_evolutions.some(x =>  x.year === newData.year && x.aacc === newData.aacc && x.technology === newData.technology)){
            //     return response.status(409).json({ error: "Ya existe ese dato" });
            // }
            db.find({year : newData.year, aacc : newData.aacc, technology : newData.technology }, (_err, existingData) => {
                if(existingData.length > 0){
                 return response.status(409).json({ error: "Ya existe ese dato" });
                }
                else{
                    //annual_evolutions.push(newData);
                    db.insert(newData);
                    response.sendStatus(201);
                }
            }); 
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


    app.put(BASE_API + "/annual-evolutions/:aacc/:year/:technology", (request, response) => {
        let aacc = request.params.aacc;
        let year = request.params.year;
        let tech = request.params.technology;
        let data = request.body;
        console.log(`New PUT to /annual-evolutions/${aacc}`);
        if (!data.aacc || (aacc == data.aacc && year == data.year && tech == data.technology)){
            db.update(
                { aacc: data.aacc, year : data.year, technology: data.technology}, // Clave única del registro
                { $set: data }, // Se actualiza el resto de campos
                {}, // vacio solo cambia el primer elemento
                (_err, nReplaced) => {
                    if(nReplaced > 0){
                        response.status(200).json({ message: "Datos actualizados correctamente" });
                    }
                    else{
                        response.status(404).json({error: `No se encuentran datos de ${aacc}`});
                    }
                }
            );
        }
        else{
            return response.status(400).json({error: "No se puede modificar el id"});
        }
    });

    //DELETE
    app.delete(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New DELETE to /annual-evolutions");
        //annual_evolutions = [];
        db.remove({}, {multi : true}, (_err, nRemoved) => {
            //{ multi: true } permite borrar múltiples registros
            response.status(200).json({ message: `Datos eliminados correctamente (${nRemoved} registros eliminados)` });
        })
    });


    app.delete(BASE_API + "/annual-evolutions" + "/:aacc", (request, response) => {
        const aacc = request.params.aacc;
        console.log(`New GET to /annual-evolutions/${aacc}`);

        db.remove({aacc : aacc}, {multi : true}, (_err, nRemoved) => {
            if (nRemoved > 0){
                response.status(200).json({ message: `Datos eliminados correctamente (${nRemoved} registros eliminados)` });
            }
            else{
                response.status(404).json({error: `No se encuentran datos de ${aacc}`});
            }
        });  
    });



};

export {loadBackendCRR};