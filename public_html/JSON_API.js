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
    if(!parat)
        parat = true;
}

function executarDades() {
    if(parat)
        parat = false;
}

//Si la variable parat o permet executem el codi per actualitzar les dades.
function comprobarDades() {
    console.log(parat);
    if(!parat){
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
        isNaN(arrayTipus[data.stations[i].type]) ? arrayTipus[data.stations[i].type] = 0 : arrayTipus[data.stations[i].type]++;
        isNaN(arrayBicisPerTipus[data.stations[i].type]) ? arrayBicisPerTipus[data.stations[i].type] = parseInt(data.stations[i].bikes) : arrayBicisPerTipus[data.stations[i].type] += parseInt(data.stations[i].bikes);
        isNaN(arraySlots[data.stations[i].type]) ? arraySlots[data.stations[i].type] = parseInt(data.stations[i].slots) : arraySlots[data.stations[i].type] += parseInt(data.stations[i].slots);
    }
    for (tipo in arrayTipus)
    {
        linea = linea + "<br>Estació tipus:" + tipo + " hi ha <strong>" + arrayTipus[tipo] + "</strong> estacions amb <strong>" + arrayBicisPerTipus[tipo] + "</strong> bicis disponibles i <strong>" + arraySlots[tipo] + "</strong> slots lliures.";
    }
    //afegueixo contingut dins html
    contingut.innerHTML=(linea + "</p>");
}


var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap);

//var circle = L.circle([51.508, -0.11], {
//    color: 'red',
//    fillColor: '#f03',
//    fillOpacity: 0.5,
//    radius: 500
//}).addTo(mymap);
//
//var polygon = L.polygon([
//    [51.509, -0.08],
//    [51.503, -0.06],
//    [51.51, -0.047]
//]).addTo(mymap);
