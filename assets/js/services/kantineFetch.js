const cacheKey = "KantineDailyFetch"

// Fetch the kantine menu and cache it locally keyed by today's date.
export const hentRet = async () => {
    const cashed = localStorage.getItem(cacheKey)
    // Date string YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0]

    if (cashed) {
        const { data, date } = JSON.parse(cashed)
        if (date === today) {
            // cached data is for today
            console.log('Kantine: using cached data for', date);
            return data
        }
    }

    const url = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'
    try {
        const res = await fetch(url)
        const result = await res.json()

        localStorage.setItem(cacheKey, JSON.stringify({
            data: result,
            date: today
        }))

        console.log('Kantine: fetched new data', result)
        return result
    } catch (error) {
        console.error('Kantine fetch failed', error)
        // return cached data if available (even if stale)
        if (cashed) return JSON.parse(cashed).data
        return null
    }
}

// Force a network fetch now (bypass cached date check) and update the cache.
export const fetchFreshNow = async () => {
    const url = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'
    const today = new Date().toISOString().split("T")[0]
    try {
        const res = await fetch(url)
        const result = await res.json()
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, date: today }))
        console.log('Kantine: fetched fresh data (forced)', result)
        return result
    } catch (err) {
        console.error('Kantine forced fetch failed', err)
        const cashed = localStorage.getItem(cacheKey)
        if (cashed) return JSON.parse(cashed).data
        return null
    }
}

// --- scheduling helpers: run the fetch at 05:00 on weekdays ---
let kantineTimeoutId = null
let kantineRunning = false

const computeNextWeekday5AM = () => {
    const now = new Date()
    const candidate = new Date(now)
    candidate.setHours(5, 0, 0, 0) // today at 05:00

    const isWeekday = (d) => d.getDay() >= 1 && d.getDay() <= 5 // Mon-Fri (1-5)

    if (now < candidate && isWeekday(candidate)) {
        return candidate
    }

    // otherwise advance to next day until we find a weekday 5:00
    let next = new Date(candidate.getTime() + 24 * 60 * 60 * 1000)
    while (!isWeekday(next)) {
        next = new Date(next.getTime() + 24 * 60 * 60 * 1000)
    }
    return next
}

const scheduleNextRun = async (onUpdate) => {
    if (!kantineRunning) return
    const next = computeNextWeekday5AM()
    const delay = next.getTime() - Date.now()
    // clear any existing timeout
    if (kantineTimeoutId) clearTimeout(kantineTimeoutId)
    // log next scheduled run for debugging
    console.log('Kantine: next scheduled fetch at', next.toString())
    kantineTimeoutId = setTimeout(async () => {
        try {
            // Force a fresh network fetch at scheduled time to pick up late changes
            const data = await fetchFreshNow()
            if (typeof onUpdate === 'function') onUpdate(data)
        } catch (e) {
            console.warn('kantine scheduled fetch failed', e)
        }
        // schedule the following weekday 5AM (handles weekend skip)
        scheduleNextRun(onUpdate)
    }, Math.max(0, delay))
}

// Start the kantine auto-refresh; will run at next weekday 05:00 and repeat at subsequent weekday 05:00 times.
export const startAutoRefresh = (onUpdate) => {
    if (kantineRunning) return
    kantineRunning = true
    // schedule first run
    scheduleNextRun(onUpdate)
}

export const stopAutoRefresh = () => {
    kantineRunning = false
    if (kantineTimeoutId) {
        clearTimeout(kantineTimeoutId)
        kantineTimeoutId = null
    }
}

// Convenience: force a fetch now and return the result
export const fetchNow = () => hentRet()

// auto-start the scheduler so menu updates occur even if controllers don't call startAutoRefresh
startAutoRefresh()