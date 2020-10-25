// Store API endpoint in variable
const queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform GET request to queryURL
d3.json(queryURL).then(data => {
    console.log(data);

    createFeatures(data.features);

});


function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag +
        "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " +
        feature.properties.place);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
    });

    var mags = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            return new L.Circle(latlng, {
                radius: feature.properties.mag*50000,
                fillColor: "red",
                stroke: false
            });
        }
    });

    // Adding earthquake layer to createMap function
    createMap(earthquakes, mags);
}


function createMap(earthquakes, mags) {

    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Define baseMaps object to hold base layer
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        Magnitude: mags
    };

    // Create map object
    var myMap = L.map("map", {
        center: [15, 0],
        zoom: 3,
        layers: [streetmap, mags]
    });

    // Create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};