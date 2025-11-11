import { Paragraph } from "../views/atoms/index.js"
import { Layout } from "./layoutController.js"
import { getDagensRet } from "../models/dagensRetModel.js"

export const DagensRetPage = async () => {
    const title = "Dagens Ret"

    const dagensRet = await getDagensRet()

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

    return await Layout(title, p)
}
