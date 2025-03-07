//Inicializa un array con los datos de ejemplo pestaña individual de la ficha de trabajo.
let datos_ejemplo = [["year","aacc","technology","energy_sold","installed_power","load_factor"],
[2005,"Andalucía","Biomasa",726.24343,127.98,64.7792606],
[2005,"Andalucía","Cogeneración",2975.02877,630.88,53.83197436],
[2005,"Andalucía","Eólica",910.74752,443.53,23.44071643],
[2005,"Aragón","Eólica",3139.8603,1408.71,25.4439552],
[2007,"Asturias, Principado de","Cogeneración",243.3279,72.25,38.4458928],
[2007,"Asturias, Principado de","Eólica",398.53,213.66,21.2928448],
[2007,"Asturias, Principado de","Hidráulica",208.3477,77.47,30.7008959],
[2008,"Ceuta","Residuos",4.81,2.8,19.6102414],
[2008,"Ceuta","Solar FV",0.0488,0.11,50.6434205],
[2008,"Comunitat Valenciana","Biomasa",18.6612,11.8,18.0531693],
[2008,"Comunitat Valenciana","Cogeneración",1331.9947,654.46,23.2335344],
[2009,"Murcia, Región de","Trat.residuos",367.1823,69.576,60.2446069],
[2009,"Navarra, Comunidad Foral de","Biomasa",339.5784,40.51,95.6915762]];


//Realice un algoritmo usando iteradores (forEach, Map, filter, …) 
// que permita calcular la media de valores de alguna de los campos numéricos del 
// subconjunto de filas que comparten un determinado valor en el campo de información geográfica.

let sum = 0;
let filtrados = datos_ejemplo.filter(dato => dato[1] === "Andalucía"); 
filtrados.forEach(dato => sum += dato[3]);
let promedio = sum / filtrados.length;
console.log(`El promedio de la energía vendida en Andalucía es de ${promedio}`);
