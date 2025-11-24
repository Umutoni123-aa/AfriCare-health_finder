// app.js - Updated for visually appealing facility cards
window.onload = function() {
    initMap();

    // Click listener for search button
    document.getElementById('searchBtn').addEventListener('click', searchFacilities);

    // Enter key listener for input
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchFacilities();
    });
};

async function searchFacilities() {
    const city = document.getElementById('cityInput').value.trim();
    const country = document.getElementById('countrySelect').value;
    const facilityType = document.getElementById('facilityType').value;
    const resultsDiv = document.getElementById('results');
    const searchBtn = document.getElementById('searchBtn');

    if (!city) {
        alert('Please enter a city or neighborhood.');
        return;
    }

    // Show loading state
    searchBtn.disabled = true;
    searchBtn.textContent = '⏳ Searching...';
    resultsDiv.innerHTML = `<p style="text-align:center; color:#555;">Searching for facilities in ${city}, ${country}...</p>`;
    clearMarkers();

    try {
        const location = await geocodeCity(city, country);
        centerMap(location.lat, location.lon);

        const facilities = await searchHealthFacilities(location.lat, location.lon, facilityType);

        const usefulFacilities = facilities
            .map(f => parseFacilityData(f))
            .filter(f => f.coordinates && f.name && f.name !== 'Unnamed Facility');

        if (usefulFacilities.length === 0) {
            showNoResults(city, country, facilities.length);
        } else {
            displayFacilities(usefulFacilities, city, country);
        }

    } catch (err) {
        console.error(err);
        showError(err.message);
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

function displayFacilities(facilities, city, country) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2 style="margin-bottom:16px; text-align:center; color:#0f172a;">Found ${facilities.length} facilities in ${city}, ${country}</h2>`;

    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'grid';
    cardsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    cardsContainer.style.gap = '16px';
    resultsDiv.appendChild(cardsContainer);

    facilities.forEach(facility => {
        const card = createFacilityCard(facility);
        card.id = `facility-${facility.id}`;
        cardsContainer.appendChild(card);

        // Add marker to map
        addFacilityMarker(
            facility.coordinates.lat,
            facility.coordinates.lon,
            facility.name,
            facility.amenity,
            facility.phone,
            card.id
        );
    });
}

function createFacilityCard(data) {
    const card = document.createElement('div');
    card.className = 'facility-card';
    card.style.background = '#ffffff';
    card.style.border = '1px solid #cbd5e0';
    card.style.borderRadius = '12px';
    card.style.padding = '16px';
    card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    card.onmouseover = () => card.style.transform = 'translateY(-3px)';
    card.onmouseout = () => card.style.transform = 'translateY(0)';

    let infoHTML = '';
    if (data.address && data.address !== 'Address not available') infoHTML += `<p>📍 ${data.address}</p>`;
    if (data.phone && data.phone !== 'Not available') infoHTML += `<p>📞 <a href="tel:${data.phone}">${data.phone}</a></p>`;
    if (data.website && data.website !== 'Not available') infoHTML += `<p>🌐 <a href="${data.website}" target="_blank">Website</a></p>`;
    if (data.opening_hours && data.opening_hours !== 'Hours not available') infoHTML += `<p>🕒 ${data.opening_hours}</p>`;
    if (data.operator && data.operator !== 'Unknown') infoHTML += `<p>🏢 ${data.operator}</p>`;

    // directions link
    infoHTML += `<p><a href="https://www.google.com/maps/dir/?api=1&destination=${data.coordinates.lat},${data.coordinates.lon}" target="_blank" style="font-weight:bold; color:#667eea;">🗺️ Directions</a></p>`;

    card.innerHTML = `
        <h3 style="margin-bottom:8px; color:#0f172a;">${data.name}</h3>
        <span class="tag" style="background:#eef2ff; color:#4f46e5; padding:4px 8px; border-radius:6px; font-size:0.85em;">${data.amenity.toUpperCase()}</span>
        <div class="facility-info" style="margin-top:12px; color:#334155;">
            ${infoHTML}
        </div>
    `;

    return card;
}

function showNoResults(city, country, totalFound = 0) {
    const resultsDiv = document.getElementById('results');
    if (totalFound > 0) {
        resultsDiv.innerHTML = `
            <h3 style="text-align:center; color:#667eea;">😔 No facilities with contact info</h3>
            <p style="text-align:center; color:#6c757d;">We found ${totalFound} facilities in ${city}, ${country}, but they don't have usable contact information.</p>
        `;
    } else {
        resultsDiv.innerHTML = `
            <h3 style="text-align:center; color:#667eea;">😔 No facilities found</h3>
            <p style="text-align:center; color:#6c757d;">We couldn't find any health facilities in ${city}, ${country}.</p>
        `;
    }
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div style="text-align:center; color:#ff4d4d;">
            <strong>⚠️ Error:</strong> ${message}
            <br><small>Please try another location.</small>
        </div>
    `;
}