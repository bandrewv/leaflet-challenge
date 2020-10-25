// Store API endpoint in variable
const queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform GET request to queryURL
d3.json(queryURL).then(data => {
    console.log(data);

    // createFeatures(data.features);

    console.log(data.features)
})


// function createFeatures(earthquakeData) {

//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.title +
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//     }

// }






// Create map object
var myMap = L.map("map", {
    center: [15, 0],
    zoom: 3
})

// Add tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);