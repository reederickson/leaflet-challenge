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
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL. Get earthquake data and add to map
d3.json(url).then(function (data) {
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
            layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><h3> Date: ${new Date(feature.properties.time)}</h3><hr><p>Magnitude: ${(feature.properties.mag)}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

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




// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson?minlatitude=24.396308&maxlatitude=49.384358&minlongitude=-125.000000&maxlongitude=-66.934570";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define the getColor function to assign color based on depth.
  function getColor(depth) {
    if (depth < 10) {
      return "#ffffcc";
    } else if (depth < 30) {
      return "#a1dab4";
    } else if (depth < 50) {
      return "#41b6c4";
    } else if (depth < 70) {
      return "#2c7fb8";
    } else if (depth < 90) {
      return "#253494";
    } else {
      return "#081d58";
    }
  }

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    //"Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
}