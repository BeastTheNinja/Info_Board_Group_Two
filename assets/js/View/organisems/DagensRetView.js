import { Fragment, Paragraph, Heading } from "../atoms/index.js"

// View-funktion der viser "Dagens Ret"
export const DagensRetView = (dagensRet) => {
    const element = Fragment()

    // Overskrift
    const h2 = Heading(2)
    h2.innerText = "Dagens Ret"

    // Tekstafsnit
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

    // Tilføj alt i rækkefølge
    element.append(h2, p)

    return element
}
