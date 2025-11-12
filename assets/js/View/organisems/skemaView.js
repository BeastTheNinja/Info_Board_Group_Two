import { Div, Heading } from "../atoms"

export const SkemaView = () => {
    const element = Div('skema-view');
    const h1 = Heading('Skema', 1);
    const h2 = Heading('Hvad sker der i klasserne', 2);
    h1.className = 'skema-title';
    h2.className = 'skema-subtitle';
    element.appendChild(h1);
    element.appendChild(h2);
    return element;
}