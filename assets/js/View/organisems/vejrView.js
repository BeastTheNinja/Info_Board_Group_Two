import { Div, Fragment, Heading, Image, Paragraph } from "../atoms/index.js"

export const vejrView = (item) => {
    console.log(item.weather[0].main);
    
    const container = Fragment()
    const div = Div('vejr-view')
    const h1 = Heading('Vejr', 1)

    const grader = Div('vejr-grader')
    grader.innerText = item.main.temp

    const vejrIcon = item.weather[0].icon
    const icon = Image(vejrIcon, '', 'vejr-icon')

    div.append(h1, grader, icon)

    container.append(div)
    return container
}