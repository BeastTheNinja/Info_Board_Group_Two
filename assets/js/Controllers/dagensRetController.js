import { hentRet } from "../services/kantineFetch.js"
import { DagensRetView } from "../View/molycules/DagensRetView.js"

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
    const data = await hentRet()
    const days = data.Days

    const daysToShow = getTodayAndTomorrow(days)
    const view = DagensRetView(daysToShow)

    const container = document.getElementById("app");
    container.append(view);
}