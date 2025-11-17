import { getData } from "../services/VejrFetch.js"

export const vejrPage = async () => {
    const data = await getData()
    console.log(data);
    
}