import { Heading } from "../atoms";

export const HeadingView = () => {
    const element = Heading('MainHeader', 1);
    const HeadingSub = Heading( 'SubHeader', 2);
    element.appendChild(HeadingSub);
    return element;
};

export const MainView = () => {
    const element = document.createElement('main');
    element.className = 'MainView';
    return element;
};