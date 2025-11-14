import { realTime } from "../../utils/time.js"
import { Div, Heading } from "../atoms/index.js"

export const SkemaView = (arr) => {
    const container = Div('skema-view')
    const h1 = Heading('Skema', 1)
    const h2 = Heading('Hvad sker der i klasserne', 2)
    h1.className = 'skema-title'
    h2.className = 'skema-subtitle'

    container.append(h1)
    container.append(h2)

    // small map from team code -> color class. Add more teams here as needed.
    const teamColorMap = {
        H1WE: 'team-red',
        P026: 'team-blue',
        DM01: 'team-yellow'
    }

    arr.forEach((item) => {
        const box = Div('skema-container')

        const lokale = document.createElement('article')
        lokale.className = 'lokale'
        lokale.innerText = item.Room

        const teamName = document.createElement('article')
        teamName.className = 'team-name'
        teamName.innerText = item.Team
        // assign a color pill class based on team code (sanitize key)
        const key = (item.Team || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
        const colorClass = teamColorMap[key]
        if (colorClass) teamName.classList.add('team-pill', colorClass)
        else teamName.classList.add('team-pill','team-default')

        const teamTitle = document.createElement('article')
        teamTitle.classList = 'team-title'
        teamTitle.innerText = item.Education

        const time = document.createElement('article')
        time.className = 'time'
        time.innerText = realTime(item.StartDate)

        box.append(lokale, teamName, teamTitle, time)
        container.append(box)
    })

    return container
}