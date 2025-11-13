import { Layout } from "./layoutController.js";

export const HomePage = () => {
    const title = 'Info Board';
    const content = 'Welcome to the Info Board Application';

    return Layout(title, content);
}