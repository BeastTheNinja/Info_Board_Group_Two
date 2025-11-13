import { Fragment, Paragraph, Heading, Div } from "../atoms/index.js"

export const DagensRetView = (days) => {
    const container = Fragment()

    // Simpel visning af dag og ret
    days.forEach(day => {
        const div = Div('kantine-view')

        const heading = Heading('Dagens Ret', 1)
        heading.className = 'kantine-header'
        div.append(heading)
        
        const retTitle = day.DayName.charAt(0).toUpperCase() + day.DayName.slice(1)
        const retHeader = Heading(retTitle, 3)
        retHeader.className = 'kantine-day'
        div.append(retHeader)

        const p = Paragraph('kantine-text')
        p.textContent = day.Dish
        div.append(p)

        container.append(div)
    })

    return container
}
