import { ls, mergeDeep } from "@/utils"
import { ActionArg } from "./"

// ! only nest this one-deep
interface Preferences {
  // theme: "dark" | "light" | "custom" // todo import menu
  // fontSize: number // todo import slider
  darkTheme: boolean
  roundBorders: boolean
  network: {
    metadataCacheFirst: boolean
  }
  // soundcloud: {
  //   platformEnabled: boolean
  //   defaultVolume: number
  // }
}
const defaultPreferences: Preferences = {
  // theme: "dark",
  // fontSize: 1,
  darkTheme: true,
  roundBorders: true,
  network: {
    metadataCacheFirst: true,
  },
  // soundcloud: {
  //   platformEnabled: true,
  //   defaultVolume: 1,
  // },
}

type ValPrefSub = [SettingsValue, string, string?]
const preferenceLocation = "cloudr-preferences"

export default {
  state: () => {
    const storedPreferences = ls(preferenceLocation)
    if (storedPreferences) return mergeDeep(defaultPreferences, storedPreferences)

    return defaultPreferences
  },
  actions: {
    pref({ commit }: ActionArg, pref: ValPrefSub) {
      commit("changePref", pref)
      commit("savePref", pref)
    },
  },
  mutations: {
    changePref(state: any, [val, pref, sub]: ValPrefSub) {
      if (sub && pref in state && sub in state[pref]) state[pref][sub] = val
      else if (pref in state) state[pref] = val
    },
    savePref(_: any, [val, pref, sub]: ValPrefSub) {
      const storedPreferences = ls(preferenceLocation) || {}
      const applyPreference: any = { [pref]: val }

      if (sub) applyPreference.pref = { [sub]: val }

      ls(preferenceLocation, mergeDeep(storedPreferences, applyPreference))
    },
  },
}
