// api.js - handles geocoding and facility searches

// Get coordinates of a city/neighborhood using OpenStreetMap Nominatim
async function geocodeCity(city, country) {
    const url = `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(city)},${encodeURIComponent(country)}` +
                `&format=json&limit=5&addressdetails=1`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Geocoding failed');

        const data = await res.json();
        if (!data.length) throw new Error('Location not found');

        // pick a neighborhood/suburb if available
        const preferred = ['suburb','neighbourhood','quarter','residential','commercial'];
        const specific = data.find(d => preferred.includes(d.type) || preferred.includes(d.class));
        const result = specific || data[0];

        return { lat: parseFloat(result.lat), lon: parseFloat(result.lon), display_name: result.display_name };
    } catch(err) {
        console.error(err);
        throw err;
    }
}

// Search for health facilities near a location using Overpass API
async function searchHealthFacilities(lat, lon, type) {
    const radius = 15000;
    let filter = '';

    switch(type) {
        case 'hospital': filter = '[amenity=hospital]'; break;
        case 'clinic': filter = '[amenity=clinic]'; break;
        case 'doctors': filter = '[amenity=doctors]'; break;
        case 'pharmacy': filter = '[amenity=pharmacy]'; break;
        default: filter = '[amenity~"hospital|clinic|doctors|pharmacy"]';
    }

    const query = `
        [out:json][timeout:30];
        (
            node${filter}(around:${radius},${lat},${lon});
            way${filter}(around:${radius},${lat},${lon});
            relation${filter}(around:${radius},${lat},${lon});
        );
        out body center qt;
    `;

    try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'text/plain' }
        });

        if (!res.ok) throw new Error('Overpass API error');

        const data = await res.json();
        return data.elements || [];
    } catch(err) {
        console.error(err);
        throw err;
    }
}

// Extract coordinates from Overpass element
function extractCoordinates(el) {
    if (el.lat && el.lon) return { lat: el.lat, lon: el.lon };
    if (el.center) return { lat: el.center.lat, lon: el.center.lon };
    return null;
}

// Parse facility data into simple object
function parseFacilityData(el) {
    const tags = el.tags || {};
    const coords = extractCoordinates(el);

    let name = tags.name || tags['name:en'] || tags.official_name || tags.brand || 'Unnamed Facility';
    let phone = tags.phone || tags['contact:phone'] || tags.telephone || 'Not available';
    let website = tags.website || tags['contact:website'] || tags.url || 'Not available';

    let address = tags['addr:full'] || tags['addr:street'] || tags.address || 'Address not available';
    if (address === 'Address not available') {
        const parts = [];
        if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:city']) parts.push(tags['addr:city']);
        if (parts.length) address = parts.join(', ');
    }

    const opening_hours = tags.opening_hours || tags['opening_hours:covid19'] || 'Hours not available';
    const operator = tags.operator || tags.brand || tags.network || 'Unknown';

    return {
        id: el.id,
        name,
        amenity: tags.amenity || 'health',
        phone,
        website,
        address,
        opening_hours,
        operator,
        coordinates: coords
    };
}