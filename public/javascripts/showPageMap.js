const campgroundLocation = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campgroundLocation.geometry.coordinates,
    zoom: 7
});

const marker = new mapboxgl.Marker()
    .setLngLat(campgroundLocation.geometry.coordinates)
    .addTo(map);