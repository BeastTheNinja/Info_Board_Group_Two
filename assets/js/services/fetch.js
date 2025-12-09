// Departures service: fetches nearby departures and provides an adaptive poll loop.
const API_URL = 'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
export const DEFAULT_FETCH_INTERVAL = 60 * 60 * 1000; // active: 1 hour
export const SLOW_FETCH_INTERVAL = 60 * 60 * 1000; // slow: 1 hour (will be paused 7 PM - 7 AM)

export const FETCH_INTERVAL =
  typeof window !== "undefined" && window.BUS_FETCH_INTERVAL
    ? window.BUS_FETCH_INTERVAL
    : DEFAULT_FETCH_INTERVAL;

let cache = { ts: 0, data: [] };
let serviceTimeoutId = null; // active timeout for the adaptive loop
let serviceRunning = false;
let currentIntervalMs = FETCH_INTERVAL;

const mapRawToModel = (raw) => ({
  stop:
    raw.name ||
    raw.stopName ||
    raw.stop ||
    (raw.location && raw.location.name) ||
    "",
  line:
    raw.product || raw.symbol || raw.line || raw.name || raw.direction || "",
  time:
    (
      raw.plannedDepartureTime ||
      raw.planned ||
      raw.time ||
      raw.datetime ||
      raw.expectedDeparture ||
      ""
    )
      .toString()
      .slice(0, 5) || "",
  destination: raw.destination || raw.direction || raw.to || "",
});

export async function fetchFresh() {
  const resp = await fetch(API_URL);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();

  // Try to find an array of departures in the response
  let raw = Array.isArray(json)
    ? json
    : json.departures ||
      json.Departure ||
      json.Departures ||
      json.board ||
      json.nearbyDepartureBoard;
  if (!Array.isArray(raw)) {
    const arrays = Object.values(json).filter(
      (v) => Array.isArray(v) && v.length > 0
    );
    raw = arrays.length ? arrays[0] : [];
  }

  const departures = raw.map(mapRawToModel).slice(0, 6);
  cache = { ts: Date.now(), data: departures };
  return departures;
}

export async function getDepartures() {
  if (
    Date.now() - cache.ts < FETCH_INTERVAL &&
    cache.data &&
    cache.data.length
  ) {
    return cache.data;
  }
  return fetchFresh();
}

// Start periodic refresh inside the service. Calls `onUpdate(departures)` each time new data is fetched.
export const startAutoRefresh = (onUpdate) => {
  if (serviceRunning) return;
  serviceRunning = true;

  const isNight = () => {
    const h = new Date().getHours();
    // consider night between 23:00-06:00
    return h >= 23 || h < 6;
  };

  const isOffHours = () => {
    const h = new Date().getHours();
    // Don't fetch between 7 PM (19:00) and 7 AM (07:00)
    return h >= 19 || h < 7;
  };

  const computeInterval = () => {
    // If off-hours (7 PM - 7 AM), don't fetch at all by returning very large interval
    if (isOffHours()) return 24 * 60 * 60 * 1000; // 24 hours, effectively pause
    // If document is hidden, slow down
    if (typeof document !== "undefined" && document.visibilityState !== "visible")
      return SLOW_FETCH_INTERVAL;
    return DEFAULT_FETCH_INTERVAL;
  };

  // perform an immediate fetch and render
  (async () => {
    try {
      const deps = await fetchFresh();
      if (typeof onUpdate === "function") onUpdate(deps);
    } catch (e) {
      console.warn("initial fetch failed", e);
    }
    // start the adaptive loop
    currentIntervalMs = computeInterval();
    const loop = async () => {
      if (!serviceRunning) return;
      try {
        // re-evaluate interval each tick
        currentIntervalMs = computeInterval();
        const deps = await fetchFresh();
        if (typeof onUpdate === "function") onUpdate(deps);
      } catch (e) {
        console.warn("fetch service periodic refresh failed", e);
      } finally {
        // schedule next run with currentIntervalMs
        serviceTimeoutId = setTimeout(loop, currentIntervalMs);
      }
    };
    // schedule first loop tick
    serviceTimeoutId = setTimeout(loop, currentIntervalMs);
  })();

  // Listen to visibility changes to speed up/slow down next ticks
  if (typeof document !== "undefined") {
    const onVisibility = () => {
      // recompute interval and restart timeout so change takes effect immediately
      if (serviceTimeoutId) clearTimeout(serviceTimeoutId);
      currentIntervalMs = computeInterval();
      serviceTimeoutId = setTimeout(async () => {
        try {
          const deps = await fetchFresh();
          if (typeof onUpdate === "function") onUpdate(deps);
        } catch (e) {
          console.warn("fetch on visibility change failed", e);
        }
        // continue adaptive loop
        if (serviceRunning) {
          const loop = async () => {
            if (!serviceRunning) return;
            try {
              currentIntervalMs = computeInterval();
              const deps = await fetchFresh();
              if (typeof onUpdate === "function") onUpdate(deps);
            } catch (e) {
              console.warn("fetch service periodic refresh failed", e);
            } finally {
              serviceTimeoutId = setTimeout(loop, currentIntervalMs);
            }
          };
          serviceTimeoutId = setTimeout(loop, currentIntervalMs);
        }
      }, 0);
    };
    document.addEventListener("visibilitychange", onVisibility);
    // store handler so we can remove it on stop
    if (typeof window !== "undefined") window.__busVisibilityHandler = onVisibility;
  }
  // expose id for debug
  if (typeof window !== "undefined") window.__busServiceIntervalId__ = serviceTimeoutId;
};

export const stopAutoRefresh = () => {
  serviceRunning = false;
  if (serviceTimeoutId) {
    clearTimeout(serviceTimeoutId);
    serviceTimeoutId = null;
  }
  if (typeof document !== "undefined" && window.__busVisibilityHandler) {
    document.removeEventListener("visibilitychange", window.__busVisibilityHandler);
    window.__busVisibilityHandler = null;
  }
  if (typeof window !== "undefined") window.__busServiceIntervalId__ = null;
};
