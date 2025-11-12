import { Layout } from "./layoutController.js"
import { getDagensRet } from "../models/dagensRetModel.js"
import { DagensRetView } from "../views/molecules/DagensRetView.js"

export const DagensRetPage = async () => {
    const title = "Dagens Ret"
    const dagensRet = await getDagensRet()
    const view = DagensRetView(dagensRet)
    return await Layout(title, view)
}
