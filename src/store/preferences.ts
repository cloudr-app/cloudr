import { ls, mergeDeep } from "@/utils"

// ! only nest this one-deep
interface Preferences {
  // theme: "dark" | "light" | "custom"
  // fontSize: number
  test: boolean
  network: {
    metadataCacheFirst: boolean
  }
  soundcloud: {
    enabled: boolean
    // defaultVolume: number
  }
}
const defaultPreferences: Preferences = {
  // theme: "dark", // todo import menu
  // fontSize: 1, // todo import slider
  test: false,
  network: {
    metadataCacheFirst: true,
  },
  soundcloud: {
    enabled: true,
    // defaultVolume: 1,
  },
}

export default {
  state: () => {
    const storedPreferences = ls("cloudr-preferences")
    if (storedPreferences) return mergeDeep(defaultPreferences, storedPreferences)

    return defaultPreferences
  },
  mutations: {
    changePref(state: any, [pref, val]: [string, SettingsValue]) {
      if (pref in state) state[pref] = val
    },
    changeSubPref(state: any, [pref, sub, val]: [string, string, SettingsValue]) {
      if (pref in state && sub in state[pref]) state[pref][sub] = val
    },
  },
}
