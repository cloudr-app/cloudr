import { createApp } from "vue"
import App from "./App.vue"
import SvgIcon from "./components/functional/SvgIcon"
import "./registerServiceWorker"
import router from "./router"
import store, { key } from "./store/store"

import * as Sentry from "@sentry/browser"
import { Integrations } from "@sentry/tracing"

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://b4d1c9034e3349dc8ba8014ad9de3b86@o105856.ingest.sentry.io/5596134",
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

// import { Plugins, Capacitor } from "@capacitor/core"
// import "./registerServiceWorker"
// const { StatusBar } = Plugins

// if (Capacitor.isPluginAvailable("StatusBar")) {
//   StatusBar.setBackgroundColor({
//     color: "#222436",
//   })
// }

createApp(App)
  .use(store, key)
  .use(router)
  .component("svg-icon", SvgIcon)
  .mount("#app")
