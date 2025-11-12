import { Heading } from "../atoms/index.js";

export const HeadingView = (title, content) => {
   const element = document.createElement('header');
   element.className = 'MainHeader';
   const h1 = Heading(title, 1);
   const h2 = Heading(content, 2);
   element.appendChild(h1);
   element.appendChild(h2);
   return element;
};

export const MainView = () => {
    const element = document.createElement('main');
    element.className = 'MainView';
    const h1 = Heading('Main Content', 1);
    element.appendChild(h1);
    return element;
};