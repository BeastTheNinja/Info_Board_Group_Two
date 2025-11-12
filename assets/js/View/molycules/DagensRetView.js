import { Fragment, Paragraph, Heading } from "../atoms/index.js"

export const DagensRetView = (dagensRet) => {
    const element = Fragment()

    const h2 = Heading(2)
    h2.innerText = "Dagens Ret"

    const p = Paragraph()

    if (dagensRet) {
        p.innerHTML = `
            <strong>${dagensRet.title}</strong><br>
            ${dagensRet.description || ""}<br>
            <em>Pris: ${dagensRet.price ? dagensRet.price + " kr." : "Ukendt"}</em>
        `
    } else {
        p.innerText = "Der er ingen Dagens Ret lige nu."
    }

    element.append(h2, p)
    return element
}
