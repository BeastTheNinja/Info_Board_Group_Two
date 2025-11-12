import { Fragment } from "../View/atoms/index.js";
import { HeadingView, MainView } from "../View/molycules";

export const Layout = (title, content) => {
  document.title = title;

  const element = Fragment();
  element.append(HeadingView(title, content), MainView());
  return element;
};
