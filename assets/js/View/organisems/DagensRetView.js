import { Fragment, Paragraph, Heading, Div } from "../atoms/index.js"

// Renders the left-column kantine view: clock + dagens-ret cards.
export const DagensRetView = (days) => {
    const container = Fragment()
    // If no days are provided (API unreachable or no menu), render a small placeholder message
    if (!Array.isArray(days) || days.length === 0) {
        const div = Div('kantine-view')

        // Move any existing clock into the left column as its own card
        const clockEl = document.getElementById('clock')
        if (clockEl && clockEl.parentElement !== div) {
            clockEl.classList.remove('clock-embedded')
            clockEl.classList.add('clock-card')
            div.append(clockEl)
        }

        // create a separate card for dagens ret under the clock
        const dagensCard = Div('dagens-card')
        const heading = Heading('Dagens Ret', 1)
        heading.className = 'dagens-title'
        dagensCard.append(heading)

        const placeholder = Paragraph('dagens-sub')
        placeholder.textContent = 'Kantinedata ikke tilgængelig i dag'
        dagensCard.append(placeholder)

        div.append(dagensCard)
        container.append(div)
        return container
    }

    // Create the left column container and place clock + dagens-card as siblings
    const div = Div('kantine-view')

    // Move the existing clock into the left column as its own card
    const clockEl = document.getElementById('clock')
    if (clockEl && clockEl.parentElement !== div) {
        clockEl.classList.remove('clock-embedded')
        clockEl.classList.add('clock-card')
        div.append(clockEl)
    }

    // create a separate card for dagens ret below the clock
    const dagensCard = Div('dagens-card')
    const heading = Heading('Dagens Ret', 1)
    heading.className = 'dagens-title'
    dagensCard.append(heading)

    days.forEach(day => {
        const retTitle = day.DayName.charAt(0).toUpperCase() + day.DayName.slice(1)
        const retHeader = Heading(retTitle, 3)
        retHeader.className = 'dagens-day'
        dagensCard.append(retHeader)

        const p = Paragraph('dagens-sub')
        p.textContent = day.Dish
        dagensCard.append(p)
    })

    div.append(dagensCard)
    container.append(div)
    return container
}
