import Vue from "vue"
import App from "@/App.vue"
import router from "@/router"
import store from "@/store"

import { Plugins, Capacitor } from "@capacitor/core"
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
