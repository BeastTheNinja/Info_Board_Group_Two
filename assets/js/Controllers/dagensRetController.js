import { Layout } from "./layoutController.js"
import { getDagensRet } from "../models/dagensRetModel.js"
import { DagensRetView } from "../views/molecules/DagensRetView.js"

// Controller til "Dagens Ret"-siden
export const DagensRetPage = async () => {
    const title = "Dagens Ret"

    try {
        //  Hent data fra modellen (API eller lokal data)
        const dagensRet = await getDagensRet()

        //  Opret view ud fra dataen
        const content = DagensRetView(dagensRet)

        //  Pak view’et ind i det fælles layout (header, nav, main, footer)
        return await Layout(title, content)
    } catch (error) {
        console.error("Fejl i DagensRetPage:", error)

        // Fejlvisning i tilfælde af at API-kaldet fejler
        const errorContent = DagensRetView(null)
        return await Layout(title, errorContent)
    }
}
