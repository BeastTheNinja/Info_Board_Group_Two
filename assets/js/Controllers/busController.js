// Bus controller: creates a grid wrapper and renders departures.
// The service handles polling; controller focuses on rendering and exposing debug helpers.
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
        // make the wrapper the grid item by giving it the panel class
        root.className = 'bus-view';
        app.appendChild(root);
    }
    // clear previous
    root.innerHTML = '';
    const view = BusView(departures);
    // Ensure only the outer `root` carries the `.bus-view` grid class
    if (view && view.classList && view.classList.contains('bus-view')) view.classList.remove('bus-view');
    root.appendChild(view);
};

export const BusPage = async (force = false) => {
    const app = document.getElementById('app');
    if (!app) return;

    // show small loading indicator in the root
    let root = document.getElementById('bus-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'bus-root';
        root.className = 'bus-view';
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