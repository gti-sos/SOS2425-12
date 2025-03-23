let campos = ["region", "year", "electricity", "gas", "other", "total_consumption", "consumption_per_capita", "co2_emission"];
let datos = [
    [2022, "País Vasco", 1653989, 830160, 445559, 2929708, 38903],
    [2022, "Andalucía", 736139, 306174, 53975, 1096288, 1008],
    [2022, "Balears, Illes", 936136, 283772, 133730, 1353638, 18047],
    [2022, "Ceuta", 25137, 2997, 9201, 37335, 7516],
    [2022, "Murcia, Región de", 55808, 4457, 23865, 84130, 12698],
    [2022, "Extremadura", 377849, 141680, 64635, 584164, 4851],
    [2022, "Melilla", 873255, 427336, 222283, 1522874, 14569],
    [2022, "Comunitat Valenciana", 699022, 280807, 152026, 1131855, 11592],
    [2022, "Madrid, Comunidad de", 3059538, 1299161, 461454, 4820153, 350],
    [2022, "Galicia", 1556787, 1854275, 195796, 3606858, 2327],
    [2022, "Canarias", 257564, 118755, 25752, 402071, 6396],
    [2022, "Navarra, Comunidad Foral de", 955804, 533971, 162055, 1651830, 9556],
    [2022, "Castilla y León", 580695, 264888, 80221, 925804, 21596],
    [2022, "Castilla - La Mancha", 482986, 294992, 348385, 1126363, 11033],
    [2022, "Cantabria", 521745, 217558, 119286, 858589, 4661],
    [2022, "Asturias, Principado de", 1435585, 776666, 141953, 2354204, 14488],
    [2022, "Cataluña", 109882, 43271, 15293, 168446, 1608],
    [2021, "Ceuta", 941599, 448222, 209546, 1599367, 38903],
    [2021, "Madrid, Comunidad de", 477683, 163788, 53155, 694626, 1008],
    [2021, "Andalucía", 543877, 174503, 84090, 802470, 18047]];


    function calcularMediaPorRegion(region, indiceCampo) {
        let subset = datos.filter(dato => dato[1] === region);
        let suma = subset.reduce((acc, dato) => acc + dato[indiceCampo], 0);
        return subset.length > 0 ? suma / subset.length : 0;
    }
    function muestraDatos(datos) {
        console.log(datos);
    }

    let region = "Andalucía";
    let indiceCampo = 2; // Cambiar al índice del campo numérico deseado
    //let data = muestraDatos(datos);
    let media = calcularMediaPorRegion(region, indiceCampo);
    console.log(`La media del campo ${campos[indiceCampo]} para la región ${region} es ${media}`);