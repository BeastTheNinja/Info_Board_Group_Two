// Lightweight fetch service for departures. Keeps a small in-memory cache
// and exposes getDepartures(force) and fetchFresh() so controllers can call them.

const API_URL = 'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
export const DEFAULT_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const FETCH_INTERVAL = (typeof window !== 'undefined' && window.BUS_FETCH_INTERVAL) ? window.BUS_FETCH_INTERVAL : DEFAULT_FETCH_INTERVAL;

let cache = { ts: 0, data: [] };
let serviceIntervalId = null;

const mapRawToModel = (raw) => ({
    stop: raw.name || raw.stopName || raw.stop || (raw.location && raw.location.name) || '',
    line: raw.product || raw.symbol || raw.line || raw.name || raw.direction || '',
    time: (raw.plannedDepartureTime || raw.planned || raw.time || raw.datetime || raw.expectedDeparture || '').toString().slice(0,5) || '',
    destination: raw.destination || raw.direction || raw.to || '',
});

export async function fetchFresh() {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();

    // Try to find an array of departures in the response
    let raw = Array.isArray(json) ? json : json.departures || json.Departure || json.Departures || json.board || json.nearbyDepartureBoard;
    if (!Array.isArray(raw)) {
        const arrays = Object.values(json).filter(v => Array.isArray(v) && v.length > 0);
        raw = arrays.length ? arrays[0] : [];
    }

    const departures = raw.map(mapRawToModel).slice(0, 4); // limit to 4 items
    cache = { ts: Date.now(), data: departures };
    return departures;
}

export async function getDepartures() {
    if (Date.now() - cache.ts < FETCH_INTERVAL && cache.data && cache.data.length) {
        return cache.data;
    }
    return fetchFresh();
}

// Start periodic refresh inside the service. Calls `onUpdate(departures)` each time new data is fetched.
export const startAutoRefresh = (onUpdate) => {
    if (serviceIntervalId) return;
    serviceIntervalId = setInterval(async () => {
        try {
            if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
            const deps = await fetchFresh();
            if (typeof onUpdate === 'function') onUpdate(deps);
        } catch (e) {
            // swallow errors - controller can log if needed
            console.warn('fetch service periodic refresh failed', e);
        }
    }, FETCH_INTERVAL);
    // expose id for debug
    if (typeof window !== 'undefined') window.__busServiceIntervalId__ = serviceIntervalId;
};

export const stopAutoRefresh = () => {
    if (serviceIntervalId) {
        clearInterval(serviceIntervalId);
        serviceIntervalId = null;
        if (typeof window !== 'undefined') window.__busServiceIntervalId__ = null;
    }
};
