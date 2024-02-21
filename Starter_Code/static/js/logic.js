// Create Earthquake Visualization
// Get Dataset
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

// Determine marker size by magnitude
function markerSize(magnitude){
    return magnitude * 2000;
};

//Determine marker color by depth
// I used https://online-free-tools.com/en/css_color_hex_gradient to make my beautiful gradient
function chooseColor(depth){
    if (depth < 10) return "#33CCFF";
    else if (depth < 30) return "#60C0F3";
    else if (depth < 50) return "#8DB5E8";
    else if (depth < 70) return "#A4AFE2";
    else if (depth < 90) return "#D1A4D7";
    else if (depth > 90) return "#FF99CC";
    else return "#FF0000";
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature,layer){
        layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.mag)}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    //save earthquake data in variable
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng){
            // design the markers
            let markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.1,
                color: "black",
                stroke: true,
                weight: 0.5
            }
            return L.circle(latlng,markers);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes){
    // Add tile layer
    let openMap= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    // Add baseMap
    let baseMaps = {
        "Earthquakes": earthquakes,
        "openMap": openMap
    };
}