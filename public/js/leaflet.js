export function displayMap(locations) {
  let map = L.map('map', { zoomControl: false });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //maxZoom: 19,
      attribution: '© OpenStreetMap',
      crossOrigin: ""
  }).addTo(map);
  
  const points = [];
  
  locations.forEach((loc) => {
      points.push([loc.coordinates[1], loc.coordinates[0]]);
      L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map)
        .bindPopup(`<p>Day ${loc.day ? loc.day: 'comming soon...'}: ${loc.description}</p>`, { autoClose: false })
        .openPopup();
    });
  
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
   
  map.scrollWheelZoom.disable();
  
  console.log('locations: ', locations);
}
