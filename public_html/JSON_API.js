/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    var frequenciaActualitzacio = 3;                           //inicialitzem
    setInterval(consultaDades, frequenciaActualitzacio * 1000);  //actualitzem dades cada quan toqui....
    //actualitzaDades();
})

//var dadesRebudes = {};
var lastUpdateTime = 0;

function consultaDades() {
    //alert("fede");
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
    $("#contingut").append(linea + "</p>");
}



