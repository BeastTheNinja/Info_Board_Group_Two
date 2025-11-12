import { Fragment, Paragraph, Heading, Div } from "../atoms/index.js"

export const DagensRetView = (days) => {
    const container = Fragment()

    // Simpel visning af dag og ret
    days.forEach(day => {
        const div = Div()

        const heading = Heading()
        heading.textContent = day.DayName.charAt(0).toUpperCase() + day.DayName.slice(1)
        div.append(heading)

        const p = Paragraph()
        p.textContent = day.Dish
        div.append(p)

        container.append(div)
    })

    return container
}
