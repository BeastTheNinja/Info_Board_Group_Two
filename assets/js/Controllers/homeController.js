import { Layout } from "./layoutController.js";
import { composeViews } from "../utils/composeViews.js";
import { SkemaView } from "../View/organisems/skemaView.js";
import { DagensRetView } from "../View/organisems/DagensRetView.js";
import { Div } from "../View/atoms/index.js";

export const HomePage = () => {
    const title = 'Info Board';
    const content = 'Velkommen';

    // create a few panel views and compose them into one container
    const days = []; // replace with real data when available
    const busPlaceholder = Div('bus-placeholder');
    // give bus placeholder the same id busController expects when it mounts
    busPlaceholder.id = 'bus-root';

    const mainContent = composeViews([
        () => DagensRetView(days),
        SkemaView,
        () => busPlaceholder,
    ]);

    return Layout(title, content, mainContent);
};