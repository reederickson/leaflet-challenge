// Create Earthquake Visualization

// Create map
let mymap = L.map("map",{
    center: [35,-95],
    zoom: 5
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get Dataset
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL. Get earthquake data and add to map
d3.json(queryUrl).then(function (data) {
    console.log(data);
    function mapStyle(feature){
        return{
            radius: mapRadius(feature.properties.mag),
            fillColor: mapColor(feature.geometry.coordinates[2]),
            opacity: 1,
            fillOpacity: .5,
            color: "black",
            stroke: true,
            weight: 0.5
        };
    }

    //Determine marker color by depth
    function mapColor(depth){
        if (depth < 10) return "#FFF2FE";
        else if (depth < 30) return "#FFD3FC";
        else if (depth < 50) return "#FFB1FA";
        else if (depth < 70) return "#E87BE1";
        else if (depth < 90) return "#D350CB";
        else if (depth >= 90) return "#BF3AB7";
        else return "#A825A0";
    }


    // Determine marker size by magnitude
    function mapRadius(mag){
        return mag * 2000;
    }

    // Add data to map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng);
        },
        stype: mapStyle,
        //Activate popup
        onEachFeature: function (feature, layer){
            layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${(feature.properties.mag)}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

        }
    }).addTo(myMap);

//Add Legend
let legend= L.control({position: "bottomRight"});
legend.onAdd= function() {
    let div =L.DomUtil.create("div","info legend"),
    depth= [ -10, 10, 30, 50, 70, 90];
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)
});

// // retreive earthquake data
// function createFeatures(earthquakeData) {
//     function onEachFeature(feature,layer){
//     }
//     //save earthquake data in variable
//     let earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature,
//         pointToLayer: function(feature, latlng){
//             // design the markers
//             let markers = {
//                 radius: markerSize(feature.properties.mag),
//                 fillColor: chooseColor(feature.geometry.coordinates[2]),
//                 fillOpacity: 0.1,
//                 color: "black",
//                 stroke: true,
//                 weight: 0.5
//             };
//         }
//     });