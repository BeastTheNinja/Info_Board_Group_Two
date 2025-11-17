// Skema service: cached fetch + adaptive polling (active 10min, slow 2h)
const URL = 'https://iws.itcn.dk/techcollege/schedules?departmentCode=smed'

export const DEFAULT_INTERVAL = 10 * 60 * 1000; // active: 10min
export const SLOW_INTERVAL = 2 * 60 * 60 * 1000; // slow: 2h

let cache = { ts: 0, data: null };
let timeoutId = null;
let running = false;

export async function fetchFreshSkema() {
    // Network fetch; on failure return cached data (if any)
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        cache = { ts: Date.now(), data: json };
        return json;
    } catch (err) {
        console.warn('skema fetch failed', err);
        return cache.data;
    }
}

export async function getSkema() {
    // return cached data if fresh
    if (cache.data && Date.now() - cache.ts < DEFAULT_INTERVAL) return cache.data;
    return fetchFreshSkema();
}

// Start adaptive auto-refresh. Calls onUpdate(skema) whenever new data is fetched.
export function startAutoRefresh(onUpdate) {
    if (running) return;
    running = true;

    const isNight = () => {
        const h = new Date().getHours();
        return h >= 23 || h < 6; // night between 23:00 and 06:00
    };

    const computeInterval = () => {
        if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return SLOW_INTERVAL;
        if (isNight()) return SLOW_INTERVAL;
        return DEFAULT_INTERVAL;
    };

    (async () => {
        // initial immediate fetch
        try {
            const skema = await fetchFreshSkema();
            if (typeof onUpdate === 'function') onUpdate(skema);
        } catch (e) {
            console.warn('initial skema fetch failed', e);
        }

        // adaptive loop: compute interval each tick and reschedule
        const loop = async () => {
            if (!running) return;
            const interval = computeInterval();
            try {
                const skema = await fetchFreshSkema();
                if (typeof onUpdate === 'function') onUpdate(skema);
            } catch (e) {
                console.warn('skema periodic fetch failed', e);
            } finally {
                timeoutId = setTimeout(loop, interval);
            }
        };

        // schedule first periodic run
        timeoutId = setTimeout(loop, computeInterval());
    })();

    if (typeof document !== 'undefined') {
        const onVisibility = () => {
            // restart loop immediately when visibility changes so interval is recomputed
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    const skema = await fetchFreshSkema();
                    if (typeof onUpdate === 'function') onUpdate(skema);
                } catch (e) {
                    console.warn('skema fetch on visibility change failed', e);
                }
                // continue loop
                if (running) {
                    const loop = async () => {
                        if (!running) return;
                        try {
                            const skema = await fetchFreshSkema();
                            if (typeof onUpdate === 'function') onUpdate(skema);
                        } catch (e) {
                            console.warn('skema periodic fetch failed', e);
                        } finally {
                            timeoutId = setTimeout(loop, computeInterval());
                        }
                    };
                    timeoutId = setTimeout(loop, computeInterval());
                }
            }, 0);
        };
        document.addEventListener('visibilitychange', onVisibility);
        if (typeof window !== 'undefined') window.__skemaVisibilityHandler = onVisibility;
    }
}

export function stopAutoRefresh() {
    running = false;
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    if (typeof document !== 'undefined' && window.__skemaVisibilityHandler) {
        document.removeEventListener('visibilitychange', window.__skemaVisibilityHandler);
        window.__skemaVisibilityHandler = null;
    }
}