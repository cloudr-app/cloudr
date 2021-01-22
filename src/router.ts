import Vue from "vue"
import VueRouter from "vue-router"
import { heartEmoji, platformsShort } from "@/utils"

import { Plugins } from "@capacitor/core"
const { App } = Plugins

Vue.use(VueRouter)

const platform = Object.entries(platformsShort)
  .map(plt => plt.join("|"))
  .join("|")

const routes = [
  {
    path: "/",
    name: "Home",
    component: require("@/views/Home.vue").default,
  },
  {
    path: "/share-target",
    name: "ShareTarget",
    component: require("@/views/Home.vue").default,
  },
  {
    path: "/preferences",
    name: "Preferences",
    component: require("@/views/Preferences.vue").default,
  },
  {
    path: `/:platform(${platform})/(user|u)/:id`,
    name: "User",
    component: require("@/views/User.vue").default,
  },
  {
    path: `/:platform(${platform})/(playlist|pl)/:id`,
    name: "Playlist",
    component: require("@/views/Playlist.vue").default,
  },
  {
    path: `/:platform(${platform})/(likes|${heartEmoji.join("|")})/:id`,
    name: "Likes",
    component: require("@/views/Playlist.vue").default,
  },
  {
    path: "*",
    // redirect: "/",
    component: require("@/views/SoundcloudResolve.vue").default,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ ".@/views/About.vue"),
  // },
]

const router = new VueRouter({
  routes,
  mode: "history",
})

App.addListener("appUrlOpen", data => {
  const slug = data.url.split(".app").pop()

  // We only push to the route if there is a slug present
  if (slug) {
    router.push({
      path: slug,
    })
  }
})

export default router
