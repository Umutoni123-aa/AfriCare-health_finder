// map.js - handles map setup and markers

let map;
let markers = [];

// Initialize the map
function initMap() {
    // Default center: Kigali
    map = L.map('map').setView([-1.9441, 30.0619], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

// Add a facility marker to the map
function addFacilityMarker(lat, lon, name, amenity, phone, cardId) {
    const marker = L.marker([lat, lon]).addTo(map);

    // Simple popup
    marker.bindPopup(`<strong>${name}</strong><br>${amenity}<br>📞 ${phone}`);

    // Link marker to a card (hover effect)
    if (cardId) {
        marker.cardId = cardId;
        marker.on('mouseover', () => {
            const card = document.getElementById(cardId);
            if (card) card.style.backgroundColor = '#eef6ff';
        });
        marker.on('mouseout', () => {
            const card = document.getElementById(cardId);
            if (card) card.style.backgroundColor = 'white';
        });
    }

    markers.push(marker);
}

// Center the map on a location
function centerMap(lat, lon, zoom = 13) {
    map.setView([lat, lon], zoom);
}

// Fit map to show all markers
function fitMapToMarkers() {
    if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Get current map center
function getMapCenter() {
    const center = map.getCenter();
    return { lat: center.lat, lon: center.lng };
}
