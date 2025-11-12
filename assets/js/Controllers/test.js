import { request } from "../services/kantineFetch.js"

export const getDagensRet = async () => {
    const url = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'

    const data = await request(url)

    console.log(data)
    return data

}