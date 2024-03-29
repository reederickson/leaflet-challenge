// Define mapColor function globally
function mapColor(depth) {
    if (depth < 10) return "#FFEEFD";
    else if (depth < 30) return "#F0BDFA";
    else if (depth < 50) return "#C97DEA";
    else if (depth < 70) return "#A86BE1";
    else if (depth < 90) return "#794ED4";
    else if (depth >= 90) return "#4739A1";
    else return "#1D1264";
}

// Get Dataset
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL. Get earthquake data and add to map
d3.json(url).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Give each feature a popup with the earthquakes location, date, magnitude and depth
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><h3> Date: ${new Date(feature.properties.time)}</h3><hr><p>Magnitude: ${(feature.properties.mag)}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Add GeoJSON layer with features array on earthquakeData and run onEach
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: mapColor(feature.geometry.coordinates[2]),
                opacity: 1,
                fillOpacity: 1,
                color: "black",
                stroke: true,
                weight: 0.5
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes); // Pass earthquakes data to createMap function
}

function createMap(earthquakes) {
    // Add base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create map to display street and earthquake layers
    let mymap = L.map("map", {
        center: [39, -115],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create legend control
    let legend = L.control({ position: 'bottomright'});
    legend.onAdd = function (mymap) {
        let div = L.DomUtil.create('div', 'legend'),
            depths = [-10, 10, 30, 50, 70, 90];
            labels = []; 
        // Add a label above the legend
        div.innerHTML = '<p>Depth of the event <br> in kilometers</p>';

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depths.length; i++) {
            let color = mapColor(depths[i] + 1);
            let label = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+');
            
            // Create the colored square for each interval
            let legendItem = document.createElement('div');
            legendItem.innerHTML = '<i style="background:' + color + '; width: 20px; height: 20px; display: inline-block;"></i> ' + label;
            div.appendChild(legendItem);
        }

        // Apply CSS styling to the legend control
        div.style.backgroundColor = 'white';
        div.style.padding = '3px';
        div.style.border = '1px solid #ccc';
        
        return div;
    };
    legend.addTo(mymap);


    // Layer control
    // Create baseMaps object
    let baseMaps = {
        "Street Map": street
    };
    // Create an overlay object to hold the earthquake map
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(mymap);
}
