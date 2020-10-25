// Store API endpoint in variable
const queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform GET request to queryURL
d3.json(queryURL).then(data => {
    console.log(data);

    createFeatures(data.features);

    // Add a choropleth layer
    let geojson = L.choropleth(data, {
        valueProperty: 'mag', // which property in the features to use
        scale: ['green', 'red'], // chroma.js scale - include as many as you like
        steps: 6, // number of breaks or steps in range
        mode: 'q', // q for quantile, e for equidistant, k for k-means
        style: {
            color: '#fff', // border color
            weight: 2,
            fillOpacity: 0.8
        }
    }).addTo(myMap);


    // // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    // var div = L.DomUtil.create("div", "info legend");
    // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
    // var labels = [];

    // // Add min & max
    // var legendInfo = `<h1>Depth</h1>
    //     <div class="labels">
    //     <div class="min"> ${limits[0].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 3})} </div>
    //     <div class="max"> ${limits[limits.length - 1].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 4})} </div>
    //     </div>`;

    // div.innerHTML = legendInfo;

    // limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    // });

    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    // return div;
    // };
});


function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag +
        "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " +
        feature.properties.place);
    }

    // var earthquakes = L.geoJSON(earthquakeData, {
    //     onEachFeature: onEachFeature,
    // });

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
    createMap(mags);
}


function createMap(mags) {

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
        // Earthquakes: earthquakes,
        Magnitude: mags
    };

    // Create map object
    var myMap = L.map("map", {
        center: [15, 0],
        zoom: 3,
        layers: [streetmap, mags]
    });

    // Create layer control
    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    // }).addTo(myMap);
};