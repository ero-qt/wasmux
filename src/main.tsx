/* @refresh reload */
import { render } from "solid-js/web";
import "~/styles/global.css";
import "~/styles/button.css";
import { defaultDark } from "~/styles/themes/default-dark.css";
import { App } from "~/ui";

document.documentElement.classList.add(defaultDark);

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

render(() => <App />, root);
