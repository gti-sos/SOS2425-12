import dataStore from "nedb";
import { initialData } from "./datos-CRR";
const BASE_API = "/api/v2";
//let db = new dataStore();
let db = new dataStore({ inMemoryOnly: true, autoload: true });

function loadBackendCRR(app){ 
    db.insert(initialData);

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

    // GET
app.get(BASE_API + "/annual-evolutions", (request, response) => {
    console.log("New GET to /annual-evolutions");

    const limit = parseInt(request.query.limit) || 0;
    const offset = parseInt(request.query.offset) || 0;

    let query = {};
    const filterableFields = ["aacc", "technology", "energy_sold", "installed_power", "load_factor", "year"];

    filterableFields.forEach(field => {
        if (request.query[field]) {
            const value = request.query[field];
            query[field] = isNaN(value) ? value : Number(value);
        }
    });

    // Año desde / hasta (rangos)
    if (request.query.from || request.query.to) {
        query.year = {};
        if (request.query.from) query.year.$gte = Number(request.query.from);
        if (request.query.to) query.year.$lte = Number(request.query.to);
    }

    db.find(query).skip(offset).limit(limit).exec((_err, annual_evolutions) => {
        response.status(200).send(JSON.stringify(
            annual_evolutions.map((c) => {
                delete c._id;
                return c;
            }), null, 2
        ));
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


//v2
    app.get(BASE_API + "/annual-evolutions" + "/:aacc/:year/:technology", (request, response) => {
        const aacc = request.params.aacc;
        const year = request.params.year;
        const technology = request.params.technology;
        console.log(`New GET to /annual-evolutions/${aacc}/${year}/${technology}`);

        db.find({aacc: aacc, year : parseInt(year), technology:technology}, (_err, search) => {
            if (search.length > 0){
                response.status(200).json(search.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
            else{   
                response.status(404).json({error: `No se encuentran datos de ${aacc}/${year}/${technology}`});
            }
        })
        
    });


    //POST
    app.post(BASE_API + "/annual-evolutions", (request, response) => {
        console.log("New POST to /annual-evolutions");
        let newData = request.body;

        newData.year = Number(newData.year);


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
        let technology = request.params.technology;
        let data = request.body;
        console.log(`New PUT to /annual-evolutions/${aacc}`);
        if(!data.year || !data.aacc || !data.technology || !data.energy_sold || !data.installed_power || !data.load_factor){
            return response.status(400).json({error: "Faltan datos requeridos"});
        }
        else if (!data.aacc || (aacc == data.aacc && year == data.year && technology == data.technology)){
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

//v2
    app.delete(BASE_API + "/annual-evolutions" + "/:aacc/:year/:technology", (request, response) => {
        const aacc = request.params.aacc;
        const year = request.params.year;
        const technology = request.params.technology;
        console.log(`New GET to /annual-evolutions/${aacc}/${year}/${technology}`);

        db.remove({aacc : aacc, year : parseInt(year), technology : technology}, {multi : true}, (_err, nRemoved) => {
            if (nRemoved > 0){
                response.status(200).json({ message: `Datos eliminados correctamente (${nRemoved} registros eliminados)` });
            }
            else{
                response.status(404).json({error: `No se encuentran datos de ${aacc}/${year}/${technology}`});
            }
        });  
    });



};

export {loadBackendCRR};