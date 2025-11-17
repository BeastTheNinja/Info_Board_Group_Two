import { getData } from "../services/VejrFetch.js"
import { vejrView } from "../View/organisems/vejrView.js";

export const vejrPage = async () => {
    const data = await getData()
    const app = document.getElementById('app')
    console.log(data);
    
    const view = vejrView(data)
    app.append(view)
}