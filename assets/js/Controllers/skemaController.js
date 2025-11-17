import { getSkema, startAutoRefresh, stopAutoRefresh, fetchFreshSkema } from "../services/skemaFetch.js"
import { arrAllowed } from "../utils/allowedTeams.js";
import { SkemaView } from "../View/organisems/skemaView.js";

export const SkemaPage = async () => {
    const app = document.getElementById('app')
    if (!app) return
    // root renderer for skema so we can replace content on updates
    const renderToDOM = (rawData) => {
        const rootId = 'skema-root'
        let root = document.getElementById(rootId)
        if (!root) {
            root = document.createElement('div')
            root.id = rootId
            // make the wrapper the grid item
            root.className = 'skema-view'
            app.appendChild(root)
        }
        root.innerHTML = ''

        if (!rawData || !rawData.value) {
            root.innerHTML = '<div class="loading">No skema data available</div>'
            return
        }

        const activities = rawData.value || []

        // only show events that are ongoing or in the future
        const now = new Date()
        const CLASS_DURATION_MS = 45 * 60 * 1000 // assume 45 minutes if no EndDate

        const upcoming = activities.filter((d) => {
            if (!arrAllowed.validData.includes(d.Education)) return false
            const start = d.StartDate ? new Date(d.StartDate) : null
            if (!start) return false
            const end = d.EndDate ? new Date(d.EndDate) : new Date(start.getTime() + CLASS_DURATION_MS)
            return end > now // keep if class is still ongoing or starts in the future
        })

        const sortedData = upcoming.sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate))

        const maksPerTeam = new Map()
        for (const item of sortedData) {
            if (!maksPerTeam.has(item.Team)) {
                maksPerTeam.set(item.Team, item)
            }
        }

        const finalMaks = Array.from(maksPerTeam.values())

        const fillRest = sortedData.filter(
            (item) => !finalMaks.some((t) => t.Team === item.Team)
        )

        const finalData = [...finalMaks, ...fillRest].slice(0, 10)

        const view = SkemaView(finalData)
        // Ensure we don't duplicate the panel/grid class on the inner view —
        // the outer `root` created above is the grid item.
        if (view && view.classList && view.classList.contains('skema-view')) view.classList.remove('skema-view')
        root.appendChild(view)
    }

    // initial load: try to get cached or fresh data and render immediately
    try {
        const initial = await getSkema()
        renderToDOM(initial)
    } catch (e) {
        console.warn('skema initial load failed', e)
    }

    // start background auto-refresh which will call renderToDOM on updates
    startAutoRefresh(renderToDOM)

    // expose manual controls for debugging
    window.refreshSkema = async () => {
        // force a fresh fetch (bypass cache) so manual refresh always updates
        const fresh = await fetchFreshSkema()
        renderToDOM(fresh)
        return fresh
    }
    window.stopSkemaRefresh = () => stopAutoRefresh()
}