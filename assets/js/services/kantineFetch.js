const cacheKey = "KantineDailyFetch"

export const hentRet = async () => {

    const cashed = localStorage.getItem(cacheKey)
    // Sætter datoen til er være den gældende dag, T adskiller datoen og tid og 0 skriver det først element (datoen)
    const today = new Date().toISOString().split("T")[0]

    if (cashed) {
        const { data, date } = JSON.parse(cashed)
        if (date === today) {
            console.log('Dataen er fra den: ' + date);
            return data
            
        }
    }
    const url = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'
    try {
        const res = await fetch(url)

        const result = await res.json()

        localStorage.setItem(cacheKey, JSON.stringify({
            data: result,
            date: today
        }))

        console.log(result)
        return result
    } catch (error) {
        console.error(error)
    }
}