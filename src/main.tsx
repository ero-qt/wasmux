/* @refresh reload */
import { render } from "solid-js/web";
import "~/styles/global.css";
import "~/styles/button.css";
import { App } from "~/App";
import { defaultDark } from "~/styles/themes/default-dark.css";

document.documentElement.classList.add(defaultDark);

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

render(() => <App />, root);
