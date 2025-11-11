import { BusView } from "../View/organisems/BusView.js";
import { getDepartures, fetchFresh, startAutoRefresh, stopAutoRefresh } from "../services/fetch.js";

const renderToDOM = (departures) => {
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
};

// controller no longer manages intervals; service will handle auto-refresh

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

    // start service auto-refresh and pass a render callback
    startAutoRefresh(renderToDOM);

    // expose manual refresh for dev/tests
    window.refreshBus = async () => {
        const deps = await fetchFresh();
        renderToDOM(deps);
    };
    window.stopBusRefresh = () => stopAutoRefresh();
};