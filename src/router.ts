import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { heartEmoji, platformsShort } from "@/utils"

// import { Plugins } from "@capacitor/core"
// const { App } = Plugins

const platform = Object.entries(platformsShort)
  .map(plt => plt.join("|"))
  .join("|")

const routes: Array<RouteRecordRaw> = [
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
    path: `/:platform(${platform})/:_(user|u)/:id`,
    name: "User",
    component: require("@/views/User.vue").default,
  },
  {
    path: `/:platform(${platform})/:_(playlist|pl)/:id`,
    name: "Playlist",
    component: require("@/views/Playlist.vue").default,
  },
  {
    path: `/:platform(${platform})/(likes|${heartEmoji.join("|")})/:id`,
    name: "Likes",
    component: require("@/views/Playlist.vue").default,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "SoundcloudResolve",
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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// App.addListener("appUrlOpen", data => {
//   const slug = data.url.split(".app").pop()

//   // We only push to the route if there is a slug present
//   if (slug) {
//     router.push({
//       path: slug,
//     })
//   }
// })

export default router
