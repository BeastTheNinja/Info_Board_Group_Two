import { BusView } from "../View/organisems/BusView.js";

// Simple, conservative fetch logic for an infoboard.
// - Cache results in-memory for FETCH_INTERVAL ms
// - Refresh automatically only when page is visible
// - Expose a manual refresh function for dev

const API_URL = 'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
const DEFAULT_FETCH_INTERVAL = 5 * 60 * 1000; // default 5 minutes between network calls
const FETCH_INTERVAL = (typeof window !== 'undefined' && window.BUS_FETCH_INTERVAL) ? window.BUS_FETCH_INTERVAL : DEFAULT_FETCH_INTERVAL;

let cache = { ts: 0, data: [] };
let intervalId = null;

const mapRawToModel = (raw) => ({
    stop: raw.name || raw.stopName || raw.stop || (raw.location && raw.location.name) || '',
    line: raw.product || raw.symbol || raw.line || raw.name || raw.direction || '',
    time: (raw.plannedDepartureTime || raw.planned || raw.time || raw.datetime || raw.expectedDeparture || '').slice(0,5) || '',
    destination: raw.destination || raw.direction || raw.to || '',
});

async function fetchFresh() {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();

    // Try to find an array of departures in the response
    let raw = Array.isArray(json) ? json : json.departures || json.Departure || json.Departures || json.board || json.nearbyDepartureBoard;
    if (!Array.isArray(raw)) {
        const arrays = Object.values(json).filter(v => Array.isArray(v) && v.length > 0);
        raw = arrays.length ? arrays[0] : [];
    }

    const departures = raw.map(mapRawToModel).slice(0, 4); // limit to 4 items to not overwhelm the info board
    cache = { ts: Date.now(), data: departures };
    return departures;
}

async function getDepartures() {
    if (Date.now() - cache.ts < FETCH_INTERVAL && cache.data && cache.data.length) {
        return cache.data;
    }
    return fetchFresh();
}

function renderToDOM(departures) {
    const app = document.getElementById('app');
    if (!app) return;
    // root container for bus content so we can replace it easily
    let root = document.getElementById('bus-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'bus-root';
        app.appendChild(root);
    }
    // clear previous
    root.innerHTML = '';
    const view = BusView(departures);
    root.appendChild(view);
}

export const BusPage = async (force = false) => {
    const app = document.getElementById('app');
    if (!app) return;

    // show small loading indicator in the root
    let root = document.getElementById('bus-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'bus-root';
        app.appendChild(root);
    }
    root.innerHTML = '<div class="loading">Loading departures...</div>';

    try {
        const departures = force ? await fetchFresh() : await getDepartures();
        renderToDOM(departures);
    } catch (err) {
        console.error('Failed to load departures', err);
        root.innerHTML = '<div class="error">Could not load departures. See console for details.</div>';
    }

    // start periodic refresh if not started
    if (!intervalId) {
        intervalId = setInterval(async () => {
            try {
                if (document.visibilityState !== 'visible') return; // don't fetch when not visible
                const deps = await fetchFresh();
                renderToDOM(deps);
            } catch (e) {
                console.warn('Periodic refresh failed', e);
            }
        }, FETCH_INTERVAL);
    }

    // expose manual refresh for dev/tests
    window.refreshBus = async () => BusPage(true);
};