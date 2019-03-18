/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Variables globals
var parat = false;
var frequenciaActualitzacio = 3;
var contingut = document.getElementById("contingut");
var mapa = document.getElementById("mapid");
var posBici =  new Array(2);
var map = L.map('map').setView([41.4, 2.18], 12);

//document
var tempsLabel = document.getElementById("segons");

//esdeveniments
document.getElementById("modificarTemps").addEventListener("click", modificarTemps);
document.getElementById("aturar").addEventListener("click", aturarDades);
document.getElementById("executar").addEventListener("click", executarDades);

window.setInterval(comprobarDades, frequenciaActualitzacio * 1000);

function modificarTemps() {
    tempsLabel.innerHTML = frequenciaActualitzacio;
}

function aturarDades() {
    if (!parat)
        parat = true;
}

function executarDades() {
    if (parat)
        parat = false;
}

//Si la variable parat o permet executem el codi per actualitzar les dades.
function comprobarDades() {
    console.log(parat);
    if (!parat) {
        consultaDades();
    }
}

//var dadesRebudes = {};
var lastUpdateTime = 0;

function consultaDades() {
    $.ajax({url: 'http://wservice.viabicing.cat/v2/stations?format=json'})//http://wservice.viabicing.cat/v1/getstations.php?v=2?callback=?'})
            .done(function (data) {
                console.log("ok");
                console.log(data);
                if (data.updateTime != lastUpdateTime)
                {
                    lastUpdateTime = data.updateTime;
                    actualitzaDadesPantalla(data);
                }
            })
            .fail(function (jqXHR, text, errorThrown) {
                console.log(jqXHR + "---" + text + "---" + errorThrown);
                console.log(jqXHR);
            })
            .always(function (x) {
                console.log("Fí")
            });
}

function actualitzaDadesPantalla(data)
{
    arrayTipus = [];
    arrayBicisPerTipus = [];
    arraySlots = [];


    var linea = "<p>Nova actualització <strong>" + lastUpdateTime + "</strong>";

    //recorro array i vaig posant ja dades
    for (i = 0; i < data.stations.length; i++)
    {
        posBici[i] = new Array(2);
        posBici[i][0] = data.stations[i].latitude;
        posBici[i][1] = data.stations[i].longitude;
        isNaN(arrayTipus[data.stations[i].type]) ? arrayTipus[data.stations[i].type] = 0 : arrayTipus[data.stations[i].type]++;
        isNaN(arrayBicisPerTipus[data.stations[i].type]) ? arrayBicisPerTipus[data.stations[i].type] = parseInt(data.stations[i].bikes) : arrayBicisPerTipus[data.stations[i].type] += parseInt(data.stations[i].bikes);
        isNaN(arraySlots[data.stations[i].type]) ? arraySlots[data.stations[i].type] = parseInt(data.stations[i].slots) : arraySlots[data.stations[i].type] += parseInt(data.stations[i].slots);
    }
    for (tipo in arrayTipus)
    {
        linea = linea + "<br>Estació tipus:" + tipo + " hi ha <strong>" + arrayTipus[tipo] + "</strong> estacions amb <strong>" + arrayBicisPerTipus[tipo] + "</strong> bicis disponibles i <strong>" + arraySlots[tipo] + "</strong> slots lliures.";
    }
    //afegueixo contingut dins html
    contingut.innerHTML = (linea + "</p>");

    actualitzarMapa();
}





function actualitzarMapa() {
    

    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
    }).addTo(map);
    for (i = 0; i < posBici.length; i++)
    {
//        posBici[i][0] = data.stations[i].latitude;
//        posBici[i][0] = data.stations[i].longitude;
        var marker = L.marker([posBici[i][0], posBici[i][1]]).addTo(map);
     }
//    var marker = L.marker([41.386855, 2.176666]).addTo(map);
}
