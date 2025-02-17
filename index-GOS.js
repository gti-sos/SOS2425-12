let datos = [
    [2022, "País Vasco", 1653989, 830160, 445559, 2929708, 3.48E+20, 38903],
    [2022, "Andalucía", 736139, 306174, 53975, 1096288, 8.14E+20, 1008],
    [2022, "Balears, Illes", 936136, 283772, 133730, 1353638, 1.25E+21, 18047],
    [2022, "Ceuta", 25137, 2997, 9201, 37335, 3.35E+18, 7516],
    [2022, "Murcia, Región de", 55808, 4457, 23865, 84130, 3.96E+18, 12698],
    [2022, "Extremadura", 377849, 141680, 64635, 584164, 9.85E+20, 4851],
    [2022, "Melilla", 873255, 427336, 222283, 1522874, 5.95E+19, 14569],
    [2022, "Comunitat Valenciana", 699022, 280807, 152026, 1131855, 5.35E+19, 11592],
    [2022, "Madrid, Comunidad de", 3059538, 1299161, 461454, 4820153, 6.39E+19, 350],
    [2022, "Galicia", 1556787, 1854275, 195796, 3606858, 7.05E+20, 2327],
    [2022, "Canarias", 257564, 118755, 25752, 402071, 3.62E+20, 6396],
    [2022, "Navarra, Comunidad Foral de", 955804, 533971, 162055, 1651830, 5.91E+20, 9556],
    [2022, "Castilla y León", 580695, 264888, 80221, 925804, 1.43E+20, 21596],
    [2022, "Castilla - La Mancha", 482986, 294992, 348385, 1126363, 7.66E+20, 11033],
    [2022, "Cantabria", 521745, 217558, 119286, 858589, 1.34E+21, 4661],
    [2022, "Asturias, Principado de", 1435585, 776666, 141953, 2354204, 1.08E+21, 14488],
    [2022, "Cataluña", 109882, 43271, 15293, 168446, 5.22E+20, 1608],
    [2021, "Ceuta", 941599, 448222, 209546, 1599367, 1.90E+20, 38903],
    [2021, "Madrid, Comunidad de", 477683, 163788, 53155, 694626, 5.16E+20, 1008],
    [2021, "Andalucía", 543877, 174503, 84090, 802470, 7.42E+19, 18047]];

    function calcularMediaPorRegion(region, indiceCampo) {
        let subset = datos.filter(dato => dato[1] === region);
        let suma = subset.reduce((acc, dato) => acc + dato[indiceCampo], 0);
        return subset.length > 0 ? suma / subset.length : 0;
    }

    let region = "Andalucía";
    let indiceCampo = 2; // Cambiar al índice del campo numérico deseado
    let media = calcularMediaPorRegion(region, indiceCampo);
    console.log(`La media del campo ${indiceCampo} para la región ${region} es ${media}`);