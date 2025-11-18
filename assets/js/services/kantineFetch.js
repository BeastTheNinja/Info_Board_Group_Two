const cacheKey = "KantineDailyFetch"

// Kantine fetch: cache today's menu and return cached or fetched data.
export const hentRet = async () => {
    const cashed = localStorage.getItem(cacheKey)
    const today = new Date().toISOString().split("T")[0]

    if (cashed) {
        const { data, date } = JSON.parse(cashed)
        if (date === today) {
            console.log('Kantine: using cached data for', date)
            return data
        }
    }

    const url = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'
    try {
        const res = await fetch(url)
        const result = await res.json()

        localStorage.setItem(cacheKey, JSON.stringify({ data: result, date: today }))

        console.log('Kantine: fetched new data', result)
        return result
    } catch (error) {
        console.error('Kantine fetch failed', error)
        if (cashed) return JSON.parse(cashed).data
        return null
    }
}

// Force network fetch and update cache.
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

// Schedule weekday 07:00 fresh fetches.
let kantineTimeoutId = null
let kantineRunning = false

const computeNextWeekdayMidnightOne = () => {
    const now = new Date()
    const candidate = new Date(now)
    // schedule at 07:00 (seven o'clock in the morning)
    candidate.setHours(7, 0, 0, 0)

    const isWeekday = (d) => d.getDay() >= 1 && d.getDay() <= 5

    if (now < candidate && isWeekday(candidate)) return candidate

    // advance day-by-day until next weekday candidate
    let next = new Date(candidate.getTime() + 24 * 60 * 60 * 1000)
    while (!isWeekday(next)) next = new Date(next.getTime() + 24 * 60 * 60 * 1000)
    return next
}

const scheduleNextRun = async (onUpdate) => {
    if (!kantineRunning) return
    const next = computeNextWeekdayMidnightOne()
    const delay = next.getTime() - Date.now()
    if (kantineTimeoutId) clearTimeout(kantineTimeoutId)
    console.log('Kantine: next scheduled fetch at', next.toString())
    kantineTimeoutId = setTimeout(async () => {
        try {
            const data = await fetchFreshNow() // always fetch fresh at schedule
            if (typeof onUpdate === 'function') onUpdate(data)
        } catch (e) {
            console.warn('kantine scheduled fetch failed', e)
        }
        scheduleNextRun(onUpdate)
    }, Math.max(0, delay))
}

// Start the kantine auto-refresh; will run at next weekday 07:00 and repeat at subsequent weekday 07:00 times.
export const startAutoRefresh = (onUpdate) => {
    if (kantineRunning) return
    kantineRunning = true
    scheduleNextRun(onUpdate)
}

export const stopAutoRefresh = () => {
    kantineRunning = false
    if (kantineTimeoutId) {
        clearTimeout(kantineTimeoutId)
        kantineTimeoutId = null
    }
}

// Convenience: fetch using cache logic
export const fetchNow = () => hentRet()

// auto-start scheduler by default
startAutoRefresh()