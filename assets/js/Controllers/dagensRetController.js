// DagensRet controller: render today's and tomorrow's menu and subscribe to updates.
import { hentRet, startAutoRefresh, stopAutoRefresh, fetchNow, fetchFreshNow } from "../services/kantineFetch.js"
import { DagensRetView } from "../View/organisems/DagensRetView.js"

const getTodayAndTomorrow = (days) => {
    const app = document.getElementById('app')
    if (!app) return
    const todayIndex = days.findIndex(d =>
        d.DayName.toLowerCase() === new Date().toLocaleDateString("da-DK", { weekday: "long" }).toLowerCase()
    )

    if (todayIndex === -1) return []  // fallback hvis dagen ikke findes

    const tomorrowIndex = (todayIndex + 1) % days.length
    return [days[todayIndex], days[tomorrowIndex]]
}

export const DagensRetPage = async () => {
    const app = document.getElementById('app')
    if (!app) return

    const renderToDOM = (rawData) => {
        if (!rawData || !rawData.Days) return
        const days = rawData.Days
        const daysToShow = getTodayAndTomorrow(days)
        const fragment = DagensRetView(daysToShow)
        // replace existing kantine view or append
        const newEl = fragment.firstElementChild || fragment
        const existing = app.querySelector('.kantine-view')
        if (existing) existing.replaceWith(newEl)
        else app.append(newEl)
    }

    // initial render (cached or fetched)
    try {
        const data = await hentRet()
        if (data) renderToDOM(data)
    } catch (e) {
        console.warn('Initial kantine load failed', e)
    }
    // subscribe to scheduled updates (scheduler calls renderToDOM)
    startAutoRefresh((d) => {
        try {
            if (d) renderToDOM(d)
        } catch (err) {
            console.warn('Error rendering kantine update', err)
        }
    })

    // expose manual controls for debugging
    window.refreshKantine = async (force = false) => {
        // pass true to force a fresh network fetch
        const fresh = force ? await fetchFreshNow() : await fetchNow()
        if (fresh) renderToDOM(fresh)
        return fresh
    }
    window.stopKantineRefresh = () => stopAutoRefresh()
}