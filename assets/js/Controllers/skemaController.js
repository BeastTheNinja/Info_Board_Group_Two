import { getSkema } from "../services/skemaFetch.js"
import { arrAllowed } from "../utils/allowedTeams.js";
import { SkemaView } from "../View/organisems/skemaView.js";

export const SkemaPage = async () => {
    const app = document.getElementById('app')
    if (!app) return

    const data = await getSkema()

    const activities = data.value

    const filterData = activities.filter((d) =>
    arrAllowed.validData.includes(d.Education))

    const sortedData = filterData.sort(
        (a, b) => new Date(a.StartDate) - new Date(b.StartDate)
    )

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
    app.append(view)
}