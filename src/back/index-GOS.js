import dataStore from "nedb";
const BASE_API = "/api/v1";
let db = new dataStore();

let initialData = [
    {'aacc': 'País Vasco', 'year': 2022, 'electricity': 1653989, 'gas': 830160, 'other': 445559, 'total_consumption': 2929708, 'co2_emission': 38903},
    {'aacc': 'Andalucía', 'year': 2022, 'electricity': 736139, 'gas': 306174, 'other': 53975, 'total_consumption': 1096288, 'co2_emission': 10008},
    {'aacc': 'Balears, Illes', 'year': 2022, 'electricity': 936136, 'gas': 283772, 'other': 133730, 'total_consumption': 1353638, 'co2_emission': 18047},
    {'aacc': 'Ceuta', 'year': 2022, 'electricity': 25137, 'gas': 2997, 'other': 9201, 'total_consumption': 37335, 'co2_emission': 7516},
    {'aacc': 'Murcia, Región de', 'year': 2022, 'electricity': 55808, 'gas': 4457, 'other': 23865, 'total_consumption': 84130, 'co2_emission': 12698},
    {'aacc': 'Extremadura', 'year': 2022, 'electricity': 377849, 'gas': 141680, 'other': 64635, 'total_consumption': 584164, 'co2_emission': 4851},
    {'aacc': 'Melilla', 'year': 2022, 'electricity': 873255, 'gas': 427336, 'other': 222283, 'total_consumption': 1522874, 'co2_emission': 14569},
    {'aacc': 'Comunitat Valenciana', 'year': 2022, 'electricity': 699022, 'gas': 280807, 'other': 152026, 'total_consumption': 1131855, 'co2_emission': 11592},
    {'aacc': 'Madrid, Comunidad de', 'year': 2022, 'electricity': 3059538, 'gas': 1299161, 'other': 461454, 'total_consumption': 4820153, 'co2_emission': 82350},
    {'aacc': 'Galicia', 'year': 2022, 'electricity': 1556787, 'gas': 1854275, 'other': 195796, 'total_consumption': 3606858, 'co2_emission': 2327},
    {'aacc': 'Canarias', 'year': 2022, 'electricity': 257564, 'gas': 118755, 'other': 25752, 'total_consumption': 402071, 'co2_emission': 6396},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2022, 'electricity': 955804, 'gas': 533971, 'other': 162055, 'total_consumption': 1651830, 'co2_emission': 9556},
    {'aacc': 'Castilla y León', 'year': 2022, 'electricity': 580695, 'gas': 264888, 'other': 80221, 'total_consumption': 925804, 'co2_emission': 21596},
    {'aacc': 'Castilla - La Mancha', 'year': 2022, 'electricity': 482986, 'gas': 294992, 'other': 348385, 'total_consumption': 1126363, 'co2_emission': 11063},
    {'aacc': 'Cantabria', 'year': 2022, 'electricity': 521745, 'gas': 217558, 'other': 119286, 'total_consumption': 858589, 'co2_emission': 4661},
    {'aacc': 'Asturias, Principado de', 'year': 2022, 'electricity': 1435585, 'gas': 776666, 'other': 141953, 'total_consumption': 2354204, 'co2_emission': 14488},
    {'aacc': 'Cataluña', 'year': 2022, 'electricity': 109882, 'gas': 43271, 'other': 15293, 'total_consumption': 168446, 'co2_emission': 7608},
    {'aacc': 'Ceuta', 'year': 2021, 'electricity': 941599, 'gas': 448222, 'other': 209546, 'total_consumption': 1599367, 'co2_emission': 38903},
    {'aacc': 'Madrid, Comunidad de', 'year': 2021, 'electricity': 477683, 'gas': 163788, 'other': 53155, 'total_consumption': 694626, 'co2_emission': 10008},
    {'aacc': 'Andalucía', 'year': 2021, 'electricity': 543877, 'gas': 174503, 'other': 84090, 'total_consumption': 802470, 'co2_emission': 16047},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2017, 'electricity': 306017, 'gas': 1008761, 'other': 46641, 'total_consumption': 1361419, 'co2_emission': 18955},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2018, 'electricity': 1590366, 'gas': 1474999, 'other': 394680, 'total_consumption': 3460045, 'co2_emission': 10443},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2019, 'electricity': 1337532, 'gas': 614950, 'other': 401340, 'total_consumption': 2353822, 'co2_emission': 40693},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2020, 'electricity': 549738, 'gas': 1430598, 'other': 107259, 'total_consumption': 2087595, 'co2_emission': 18531},
    {'aacc': 'Navarra, Comunidad Foral de', 'year': 2021, 'electricity': 1811529, 'gas': 391370, 'other': 144635, 'total_consumption': 2347534, 'co2_emission': 44791},
    {'aacc': 'Madrid, Comunidad de', 'year': 2017, 'electricity': 1304036, 'gas': 768781, 'other': 497967, 'total_consumption': 2570784, 'co2_emission': 48169},
    {'aacc': 'Madrid, Comunidad de', 'year': 2018, 'electricity': 554635, 'gas': 785805, 'other': 488912, 'total_consumption': 1829352, 'co2_emission': 19924},
    {'aacc': 'Madrid, Comunidad de', 'year': 2019, 'electricity': 239438, 'gas': 1134918, 'other': 175930, 'total_consumption': 1550286, 'co2_emission': 44463},
    {'aacc': 'Madrid, Comunidad de', 'year': 2020, 'electricity': 395009, 'gas': 637444, 'other': 242829, 'total_consumption': 1275282, 'co2_emission': 11939},
    {'aacc': 'Ceuta', 'year': 2017, 'electricity': 1111535, 'gas': 350750, 'other': 482355, 'total_consumption': 1944640, 'co2_emission': 46109},
    {'aacc': 'Ceuta', 'year': 2018, 'electricity': 1210550, 'gas': 184372, 'other': 237382, 'total_consumption': 1632304, 'co2_emission': 35237},
    {'aacc': 'Ceuta', 'year': 2019, 'electricity': 1799905, 'gas': 1366385, 'other': 78117, 'total_consumption': 3244407, 'co2_emission': 15645},
    {'aacc': 'Ceuta', 'year': 2020, 'electricity': 1946769, 'gas': 1013875, 'other': 254179, 'total_consumption': 3214823, 'co2_emission': 5783},
    {'aacc': 'Melilla', 'year': 2017, 'electricity': 895787, 'gas': 740876, 'other': 409499, 'total_consumption': 2046162, 'co2_emission': 45153},
    {'aacc': 'Melilla', 'year': 2018, 'electricity': 527963, 'gas': 627178, 'other': 276912, 'total_consumption': 1432053, 'co2_emission': 7762},
    {'aacc': 'Melilla', 'year': 2019, 'electricity': 865679, 'gas': 456173, 'other': 197817, 'total_consumption': 1519669, 'co2_emission': 30720},
    {'aacc': 'Melilla', 'year': 2020, 'electricity': 923659, 'gas': 715054, 'other': 481736, 'total_consumption': 2120449, 'co2_emission': 1662},
    {'aacc': 'Melilla', 'year': 2021, 'electricity': 1188840, 'gas': 534365, 'other': 460538, 'total_consumption': 2183743, 'co2_emission': 13910},
    {'aacc': 'País Vasco', 'year': 2017, 'electricity': 525879, 'gas': 1063699, 'other': 48634, 'total_consumption': 1638212, 'co2_emission': 7622},
    {'aacc': 'País Vasco', 'year': 2018, 'electricity': 1492797, 'gas': 53443, 'other': 440863, 'total_consumption': 1987103, 'co2_emission': 10411},
    {'aacc': 'País Vasco', 'year': 2019, 'electricity': 160486, 'gas': 37759, 'other': 166773, 'total_consumption': 365018, 'co2_emission': 21224},
    {'aacc': 'País Vasco', 'year': 2020, 'electricity': 719898, 'gas': 1388677, 'other': 350968, 'total_consumption': 2459543, 'co2_emission': 12189},
    {'aacc': 'País Vasco', 'year': 2021, 'electricity': 1683154, 'gas': 186103, 'other': 119552, 'total_consumption': 1988809, 'co2_emission': 19440},
    {'aacc': 'Andalucía', 'year': 2017, 'electricity': 1866123, 'gas': 1044400, 'other': 190066, 'total_consumption': 3100589, 'co2_emission': 6663},
    {'aacc': 'Andalucía', 'year': 2018, 'electricity': 1770804, 'gas': 536515, 'other': 158628, 'total_consumption': 2465947, 'co2_emission': 1219},
    {'aacc': 'Andalucía', 'year': 2019, 'electricity': 108183, 'gas': 784024, 'other': 449045, 'total_consumption': 1341252, 'co2_emission': 11990},
    {'aacc': 'Andalucía', 'year': 2020, 'electricity': 333856, 'gas': 730767, 'other': 85529, 'total_consumption': 1150152, 'co2_emission': 15636},
    {'aacc': 'Canarias', 'year': 2017, 'electricity': 729074, 'gas': 713271, 'other': 464759, 'total_consumption': 1907104, 'co2_emission': 35317},
    {'aacc': 'Canarias', 'year': 2018, 'electricity': 431210, 'gas': 30940, 'other': 153650, 'total_consumption': 615800, 'co2_emission': 14512},
    {'aacc': 'Canarias', 'year': 2019, 'electricity': 179300, 'gas': 1012306, 'other': 288532, 'total_consumption': 1480138, 'co2_emission': 14626},
    {'aacc': 'Canarias', 'year': 2020, 'electricity': 1122628, 'gas': 1364470, 'other': 36069, 'total_consumption': 2523167, 'co2_emission': 13365},
    {'aacc': 'Canarias', 'year': 2021, 'electricity': 1631017, 'gas': 456079, 'other': 64294, 'total_consumption': 2151390, 'co2_emission': 37415},
    {'aacc': 'Cataluña', 'year': 2017, 'electricity': 1593461, 'gas': 42948, 'other': 200113, 'total_consumption': 1836522, 'co2_emission': 21673},
    {'aacc': 'Cataluña', 'year': 2018, 'electricity': 1742671, 'gas': 634224, 'other': 137459, 'total_consumption': 2514354, 'co2_emission': 7936},
    {'aacc': 'Cataluña', 'year': 2019, 'electricity': 1279199, 'gas': 112743, 'other': 40131, 'total_consumption': 1432073, 'co2_emission': 8642},
    {'aacc': 'Cataluña', 'year': 2020, 'electricity': 891015, 'gas': 524262, 'other': 23296, 'total_consumption': 1438573, 'co2_emission': 14334},
    {'aacc': 'Cataluña', 'year': 2021, 'electricity': 1009560, 'gas': 125055, 'other': 498525, 'total_consumption': 1633140, 'co2_emission': 48676},
    {'aacc': 'Castilla y León', 'year': 2017, 'electricity': 1007616, 'gas': 64427, 'other': 486756, 'total_consumption': 1558799, 'co2_emission': 37545},
    {'aacc': 'Castilla y León', 'year': 2018, 'electricity': 632964, 'gas': 783277, 'other': 347988, 'total_consumption': 1764229, 'co2_emission': 22935},
    {'aacc': 'Castilla y León', 'year': 2019, 'electricity': 1939817, 'gas': 1359819, 'other': 258931, 'total_consumption': 3558567, 'co2_emission': 12620},
    {'aacc': 'Castilla y León', 'year': 2020, 'electricity': 1241596, 'gas': 436349, 'other': 459931, 'total_consumption': 2137876, 'co2_emission': 49130},
    {'aacc': 'Castilla y León', 'year': 2021, 'electricity': 1178156, 'gas': 1168563, 'other': 405542, 'total_consumption': 2752261, 'co2_emission': 3697},
    {'aacc': 'Castilla - La Mancha', 'year': 2017, 'electricity': 1917770, 'gas': 628233, 'other': 350906, 'total_consumption': 2896909, 'co2_emission': 32042},
    {'aacc': 'Castilla - La Mancha', 'year': 2018, 'electricity': 1759637, 'gas': 121806, 'other': 24377, 'total_consumption': 1905820, 'co2_emission': 23203},
    {'aacc': 'Castilla - La Mancha', 'year': 2019, 'electricity': 1616966, 'gas': 1341060, 'other': 384061, 'total_consumption': 3342087, 'co2_emission': 15246},
    {'aacc': 'Castilla - La Mancha', 'year': 2020, 'electricity': 130398, 'gas': 517708, 'other': 394857, 'total_consumption': 1042963, 'co2_emission': 48753},
    {'aacc': 'Castilla - La Mancha', 'year': 2021, 'electricity': 928020, 'gas': 648930, 'other': 373566, 'total_consumption': 1950516, 'co2_emission': 25280},
    {'aacc': 'Extremadura', 'year': 2017, 'electricity': 461899, 'gas': 1323738, 'other': 99477, 'total_consumption': 1885114, 'co2_emission': 40419},
    {'aacc': 'Extremadura', 'year': 2018, 'electricity': 1886144, 'gas': 476557, 'other': 201387, 'total_consumption': 2564088, 'co2_emission': 38876},
    {'aacc': 'Extremadura', 'year': 2019, 'electricity': 397044, 'gas': 1215702, 'other': 243040, 'total_consumption': 1855786, 'co2_emission': 49045},
    {'aacc': 'Extremadura', 'year': 2020, 'electricity': 990138, 'gas': 731186, 'other': 103630, 'total_consumption': 1824954, 'co2_emission': 27695},
    {'aacc': 'Extremadura', 'year': 2021, 'electricity': 447200, 'gas': 346121, 'other': 293011, 'total_consumption': 1086332, 'co2_emission': 37984},
    {'aacc': 'Asturias, Principado de', 'year': 2017, 'electricity': 1698603, 'gas': 872389, 'other': 105300, 'total_consumption': 2676292, 'co2_emission': 25767},
    {'aacc': 'Asturias, Principado de', 'year': 2018, 'electricity': 997188, 'gas': 805744, 'other': 155261, 'total_consumption': 1958193, 'co2_emission': 48668},
    {'aacc': 'Asturias, Principado de', 'year': 2019, 'electricity': 1704047, 'gas': 1492786, 'other': 342254, 'total_consumption': 3539087, 'co2_emission': 13424},
    {'aacc': 'Asturias, Principado de', 'year': 2020, 'electricity': 686753, 'gas': 722054, 'other': 339549, 'total_consumption': 1748356, 'co2_emission': 43585},
    {'aacc': 'Asturias, Principado de', 'year': 2021, 'electricity': 677094, 'gas': 1394793, 'other': 115772, 'total_consumption': 2187659, 'co2_emission': 3772},
    {'aacc': 'Galicia', 'year': 2017, 'electricity': 797884, 'gas': 1248505, 'other': 227567, 'total_consumption': 2273956, 'co2_emission': 21214},
    {'aacc': 'Galicia', 'year': 2018, 'electricity': 547315, 'gas': 1315172, 'other': 187609, 'total_consumption': 2050096, 'co2_emission': 9037},
    {'aacc': 'Galicia', 'year': 2019, 'electricity': 1229674, 'gas': 400683, 'other': 257512, 'total_consumption': 1887869, 'co2_emission': 30758},
    {'aacc': 'Galicia', 'year': 2020, 'electricity': 979941, 'gas': 164227, 'other': 331525, 'total_consumption': 1475693, 'co2_emission': 49464},
    {'aacc': 'Galicia', 'year': 2021, 'electricity': 1865873, 'gas': 1261146, 'other': 364399, 'total_consumption': 3491418, 'co2_emission': 28471},
    {'aacc': 'Murcia, Región de', 'year': 2017, 'electricity': 1848359, 'gas': 1409710, 'other': 209560, 'total_consumption': 3467629, 'co2_emission': 49881},
    {'aacc': 'Murcia, Región de', 'year': 2018, 'electricity': 1189479, 'gas': 1291393, 'other': 431908, 'total_consumption': 2912780, 'co2_emission': 7976},
    {'aacc': 'Murcia, Región de', 'year': 2019, 'electricity': 17344, 'gas': 792559, 'other': 338687, 'total_consumption': 1148590, 'co2_emission': 39741},
    {'aacc': 'Murcia, Región de', 'year': 2020, 'electricity': 228441, 'gas': 252068, 'other': 50731, 'total_consumption': 531240, 'co2_emission': 16234},
    {'aacc': 'Murcia, Región de', 'year': 2021, 'electricity': 1597006, 'gas': 600182, 'other': 382550, 'total_consumption': 2579738, 'co2_emission': 1019},
    {'aacc': 'Balears, Illes', 'year': 2017, 'electricity': 1278418, 'gas': 423902, 'other': 194021, 'total_consumption': 1896341, 'co2_emission': 1735},
    {'aacc': 'Balears, Illes', 'year': 2018, 'electricity': 131344, 'gas': 545090, 'other': 291655, 'total_consumption': 968089, 'co2_emission': 30849},
    {'aacc': 'Balears, Illes', 'year': 2019, 'electricity': 1336705, 'gas': 1183927, 'other': 222619, 'total_consumption': 2743251, 'co2_emission': 14359},
    {'aacc': 'Balears, Illes', 'year': 2020, 'electricity': 341918, 'gas': 960097, 'other': 434589, 'total_consumption': 1736604, 'co2_emission': 7520},
    {'aacc': 'Balears, Illes', 'year': 2021, 'electricity': 1190759, 'gas': 680858, 'other': 89576, 'total_consumption': 1961193, 'co2_emission': 8992},
    {'aacc': 'Comunitat Valenciana', 'year': 2017, 'electricity': 439492, 'gas': 1108951, 'other': 410565, 'total_consumption': 1959008, 'co2_emission': 4749},
    {'aacc': 'Comunitat Valenciana', 'year': 2018, 'electricity': 1632117, 'gas': 613543, 'other': 157133, 'total_consumption': 2402793, 'co2_emission': 39718},
    {'aacc': 'Comunitat Valenciana', 'year': 2019, 'electricity': 1687122, 'gas': 1148112, 'other': 229442, 'total_consumption': 3064676, 'co2_emission': 43948},
    {'aacc': 'Comunitat Valenciana', 'year': 2020, 'electricity': 395399, 'gas': 1382549, 'other': 402486, 'total_consumption': 2180434, 'co2_emission': 15722},
    {'aacc': 'Comunitat Valenciana', 'year': 2021, 'electricity': 1826056, 'gas': 773219, 'other': 193044, 'total_consumption': 2792319, 'co2_emission': 13689},
    {'aacc': 'Cantabria', 'year': 2017, 'electricity': 1841543, 'gas': 366426, 'other': 78037, 'total_consumption': 2286006, 'co2_emission': 48568},
    {'aacc': 'Cantabria', 'year': 2018, 'electricity': 1445638, 'gas': 91828, 'other': 410914, 'total_consumption': 1948380, 'co2_emission': 4539},
    {'aacc': 'Cantabria', 'year': 2019, 'electricity': 320206, 'gas': 1128107, 'other': 267032, 'total_consumption': 1715345, 'co2_emission': 8155},
    {'aacc': 'Cantabria', 'year': 2020, 'electricity': 1306195, 'gas': 439352, 'other': 174258, 'total_consumption': 1919805, 'co2_emission': 6200},
    {'aacc': 'Cantabria', 'year': 2021, 'electricity': 987526, 'gas': 744798, 'other': 417341, 'total_consumption': 2149665, 'co2_emission': 23624},
    ]

db.find({},(err,data)=>{
    if (data.length < 1){
        db.insert(initialData);
    }
});

function loadBackendGOS(app){
    app.get(BASE_API + "/annual-consumptions/docs", (req, res) => {
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
        console.log("New GET to /annual-consumptions");
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
    
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 0;
    
        let dbQuery = db.find(query);
        if (offset) dbQuery = dbQuery.skip(offset);
        if (limit) dbQuery = dbQuery.limit(limit);
    
        dbQuery.exec((err, results) => {
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