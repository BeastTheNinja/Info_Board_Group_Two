import { realTime } from "../../utils/time.js"
import { Div, Heading } from "../atoms/index.js"

// Builds the inner skema list. Controllers create the outer `skema-view` wrapper.
export const SkemaView = (arr) => {
    const container = Div()

    const h1 = Heading('SKEMA', 1)
    h1.className = 'skema-header'
    const h2 = Heading('Hvad sker der i klasserne', 2)
    h2.className = 'skema-sub'

    container.append(h1)
    container.append(h2)

    const teamColorMap = {
        H1WE: 'team-pill--red',
        P026: 'team-pill--blue',
        DM01: 'team-pill--yellow'
    }

    // map education/subject keywords to subject pill classes
    const subjectMap = [
        { match: /digital/i, cls: 'subject--digital' },
        { match: /web|webudvik/i, cls: 'subject--web' },
        { match: /figma/i, cls: 'subject--figma' },
        { match: /photo|photoshop/i, cls: 'subject--photoshop' },
        { match: /grafisk|grafik/i, cls: 'subject--grafisk' },
        { match: /medie/i, cls: 'subject--medie' }
    ]

    // Defensive: if arr isn't an array, return an empty container
    if (!Array.isArray(arr)) return container

    const list = document.createElement('div')
    list.className = 'skema-list'

    arr.forEach((item) => {
        const row = document.createElement('div')
        row.className = 'skema-row'

        // locale (room) pill
        const lokale = document.createElement('div')
        lokale.className = 'lokale-pill'
        const room = (item.Room || '').toString().trim()
        lokale.innerText = room
        // assign color modifier: prefer first alphabetic char, fallback to leading digit
        const alphaMatch = room.match(/[A-Za-z]/)
        if (alphaMatch && alphaMatch[0]) {
            const first = alphaMatch[0].toUpperCase()
            if (first === 'B') lokale.classList.add('lokale--b')
            else if (first === 'D') lokale.classList.add('lokale--d')
            else if (first === 'P') lokale.classList.add('lokale--p')
            else lokale.classList.add('lokale--muted')
        } else {
            // if no letter found, check for leading digits (e.g., '101') and give a default colored pill
            const digitMatch = room.match(/^\d+/)
            if (digitMatch && digitMatch[0]) lokale.classList.add('lokale--p')
            else lokale.classList.add('lokale--muted')
        }

        // team pill (colored)
        const teamCode = document.createElement('div')
        teamCode.className = 'team-pill'
        const key = (item.Team || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
        const colorClass = teamColorMap[key]
        if (colorClass) teamCode.classList.add(colorClass)
        teamCode.innerText = item.Team || ''

        // subject pill (education / course) + optional color by keyword
        const subject = document.createElement('div')
        subject.className = 'subject-pill'
        const edu = (item.Education || '').toString()
        subject.innerText = edu
        // pick a subject class by matching keywords
        const matched = subjectMap.find(s => s.match.test(edu))
        if (matched) subject.classList.add(matched.cls)
        else subject.classList.add('subject--muted')

        // time pill (right aligned)
        const time = document.createElement('div')
        time.className = 'time-pill'
        time.innerText = realTime(item.StartDate)

        row.append(lokale, teamCode, subject, time)
        list.append(row)
    })

    container.append(list)
    return container
}