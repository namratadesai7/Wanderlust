const longitude = listing.geometry.coordinates[0]; // Assuming longitude is the first element
const latitude = listing.geometry.coordinates[1]; 
	mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",    
    
    center: [longitude,latitude], // starting position [lng, lat]
    zoom: 7, // starting zoom
    });

//console.log(coordinates);
// Ensure that coordinates is in the format [longitude, latitude]

//add map marker
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat( [longitude,latitude])
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(
    `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
.addTo(map);