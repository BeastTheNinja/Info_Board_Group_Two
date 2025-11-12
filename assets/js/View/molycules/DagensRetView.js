import { Fragment, Paragraph, Heading, Div } from "../atoms/index.js"

<<<<<<< Updated upstream
export const DagensRetView = (dagensRet) => {
    const element = Fragment()

    const h2 = Heading(2)
    h2.innerText = "Dagens Ret"

    const p = Paragraph()
=======
export const DagensRetView = (days) => {
    const container = Fragment()

    // Simpel visning af dag og ret
    days.forEach(day => {
        const div = Div()

        const heading = Heading()
        heading.textContent = day.DayName.charAt(0).toUpperCase() + day.DayName.slice(1)
        div.append(heading)
>>>>>>> Stashed changes

        const p = Paragraph()
        p.textContent = day.Dish
        div.append(p)

<<<<<<< Updated upstream
    element.append(h2, p)
    return element
=======
        container.append(div)
    })

    return container
>>>>>>> Stashed changes
}
