import Vue from "vue"
import * as Sentry from "@sentry/browser"
import { Integrations } from "@sentry/tracing"

Sentry.init({
  // @ts-ignore
  Vue,
  dsn: "https://b4d1c9034e3349dc8ba8014ad9de3b86@o105856.ingest.sentry.io/5596134",
  autoSessionTracking: true,
  integrations: [new Integrations.BrowserTracing()],
  logErrors: true,
  tracesSampleRate: 1.0,
})

import App from "@/App.vue"
import router from "@/router"
import store from "@/store"

import { Plugins, Capacitor } from "@capacitor/core"
import "./registerServiceWorker"
const { StatusBar } = Plugins

if (Capacitor.isPluginAvailable("StatusBar")) {
  StatusBar.setBackgroundColor({
    color: "#222436",
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app")
