import Vue from "vue"
import VueRouter from "vue-router"
import platformShortNames from "./player/platformShortNames"

Vue.use(VueRouter)

const platform = Object.entries(platformShortNames)
  .map(plt => plt.join("|"))
  .join("|")

const routes = [
  {
    path: "/",
    name: "Home",
    component: require("./views/Home.vue").default,
  },
  {
    path: `/(playlist|pl)/:platform(${platform})/:user?/:id`,
    name: "Playlist",
    component: require("./views/Playlist.vue").default,
  },
  {
    path: "*",
    redirect: "/",
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
]

const router = new VueRouter({
  routes,
})

export default router
