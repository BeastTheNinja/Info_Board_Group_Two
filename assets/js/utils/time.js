export const realTime = (startDate) => {
    return new Date(startDate).toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Copenhagen',
        hour: '2-digit',
        minute: '2-digit',
    })
}