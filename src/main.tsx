/* @refresh reload */
import { render } from "solid-js/web";
import "~/styles/global.css";
import "~/styles/button.css";
import { App } from "~/App";
import { negotiateLocale, setLocale } from "~/i18n";
import { defaultDark } from "~/styles/themes/default-dark.css";

setLocale(negotiateLocale(navigator.languages));
document.documentElement.classList.add(defaultDark);

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

render(() => <App />, root);
