import { Fragment } from "../View/atoms/index.js";
import { HeadingView, MainView } from "../View/molycules/index.js";

export const Layout = (title, content, mainContent) => {
  document.title = title;

  const element = Fragment();
  // If a mainContent element is provided, use it. Otherwise fall back to the default MainView.
  element.append(HeadingView(title, content), mainContent || MainView());
  return element;
};
