module.exports = function() {
    
    let datos = [[2017,"Biomasa",3984.8567,536521.12,148150.2,178340.4,326490.61, "Murcia, Región de"],
        [2017,"Cogeneración",25262.1421,2506572.04,81583.52,1084262.51,1165846.03, "Murcia, Región de"],
        [2017,"Eólica",35149.794,3860554.53,1472879.98,0,1472879.98, "Asturias, Principado de"],
        [2017,"Hidráulica",1698.0004,287182.82,83230.89,1063.44,84294.33, "Cataluña"],
        [2017,"Otras tecn. renovables",0.2328,193.46,151.2,31.22,182.42, "Murcia, Región de"],
        [2017,"Residuos",2813.9292,265275.15,78490.99,26614.72,105105.72, "Cataluña"],
        [2017,"Solar FV",8339.3808,2932739.57,2299769.37,202919.64,2502689.02, "Asturias, Principado de"],
        [2017,"Solar TE",5347.6972,1594779.26,1085765.22,234998.04,1320763.25, "Cataluña"],
        [2017,"Trat.residuos",2419.3571,292381.6,12428.54,152417.83,164846.37, "Asturias, Principado de"],
        [2018,"Biomasa",3951.7731,554749.98,148533.7,176419.89,324953.59, "Cataluña"],
        [2018,"Cogeneración",25935.3492,2713723.05,81485.92,1127022.62,1208508.54, "Asturias, Principado de"]];

    
    function prueba(){
        let sum = 0;
        let filtered = datos.filter(d => d[7] === "Asturias, Principado de");
        filtered.forEach(d => sum += d[3]);

        return("The average total compensation in Principado de Asturias from the example list is " + sum/filtered.length);
    };

    return prueba();
};