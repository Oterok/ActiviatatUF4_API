window.onload = function() {

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Estacions Bike i Bike Eletric"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: [
                    {y: 90.25, label: "BIKE"}, // % Bikes normals
                    {y: 9.75, label: "BIKE-ELECTRIC"}, // % Bike electriques
                ]
            }]
        });

        chart.render();

        }