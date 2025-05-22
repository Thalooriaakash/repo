const map = L.map('map').setView(listingData.coordinates, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Marker
L.marker([listingData.coordinates[1], listingData.coordinates[0]])
  .addTo(map)
  .bindPopup(listingData.title)
  .openPopup();
