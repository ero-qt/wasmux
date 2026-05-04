/* @refresh reload */
import { render } from "solid-js/web";
import "~/styles/global.css";
import "~/styles/button.css";
import { App } from "~/App";
import { negotiateLocale, setLocale } from "~/i18n";
import { defaultDark } from "~/styles/themes/default-dark.css";

setLocale(negotiateLocale(navigator.languages));
document.documentElement.classList.add(defaultDark);

// register the service worker only in production builds; dev caching would
// fight Vite's HMR and confuse "why didn't my edit show up".
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch((err) => {
    console.error("Service worker registration failed:", err);
  });
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

render(() => <App />, root);
