import { Div, Heading, Image, Paragraph, Ul, Li } from "../atoms/index.js";

// BusView accepts an array of departure items and renders them.
// Each item is expected to be an object with fields like stop, line, plannedDeparture, expectedDeparture, destination.
export const BusView = (departures = []) => {
    const element = Div('bus-view');

    // Header
    const header = Div('bus-header');
    const logo = Image('assets/img/Vector.svg', 'bus logo', 'bus-logo');
    const title = Heading('BUS', 2);
    header.appendChild(logo);
    header.appendChild(title);

    element.appendChild(header);

    // Container for departure cards
    const list = Ul('bus-list');

    if (!Array.isArray(departures) || departures.length === 0) {
        const empty = Li('bus-empty');
        empty.innerText = 'No upcoming departures';
        list.appendChild(empty);
        element.appendChild(list);
        return element;
    }

    departures.forEach((d) => {
        const item = Li('bus-item');

        // Stop / name
        const stop = Div('bus-stop');
        const stopText = (d.stop || d.name || d.stopName || 'Unknown stop').toString().trim();
        stop.innerText = stopText;

        // Times
        const times = Div('bus-times');
        const dep = Div('bus-departure');
        dep.innerText = (d.time || d.plannedDeparture || d.planned || d.expectedDeparture || '').toString().slice(0,5) || '';
        const arr = Div('bus-arrival');
        arr.innerText = (d.plannedArrival || d.arrival || d.expectedArrival || '').toString().slice(0,5) || '';
        times.appendChild(dep);
        times.appendChild(arr);

        // Line pill and destination. Don't repeat the same text twice.
        const meta = Div('bus-meta');
        const lineText = (d.line || d.product || d.name || d.direction || '').toString().trim();
        const destText = (d.destination || d.to || d.direction || '').toString().trim();

        // Show line only if it's meaningful and not identical to stop or destination
        if (lineText && lineText !== stopText && lineText !== destText) {
            const line = Div('bus-line');
            line.innerText = lineText;
            meta.appendChild(line);
        }

        // Show destination if present and not the same as stop
        if (destText && destText !== stopText) {
            const dest = Div('bus-destination');
            dest.innerText = destText;
            meta.appendChild(dest);
        }

        item.appendChild(stop);
        item.appendChild(times);
        item.appendChild(meta);
        list.appendChild(item);
    });

    element.appendChild(list);
    return element;
};