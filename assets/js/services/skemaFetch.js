export const getSkema = async () => {
    const url = 'https://iws.itcn.dk/techcollege/schedules?departmentCode=smed'

    try {
        const res = await fetch(url)
        const result = res.json()
        return result
    } catch (error) {
        console.error(error);
    }
}