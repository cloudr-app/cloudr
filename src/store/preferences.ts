import { preferenceLocation } from "@/strings"
import { SettingsValue } from "@/types"
import { ls, updateDeep } from "@/utils"
import { ActionArg } from "./"

// ! only nest this one-deep
export interface Preferences {
  // theme: "dark" | "light" | "custom" // todo import menu
  // fontSize: number // todo import slider
  defaultVolume: number
  theme: {
    darkTheme: boolean
    monochromeTheme: boolean
    roundBorders: boolean
  }
  network: {
    metadataCacheFirst: boolean
  }
  // soundcloud: {
  //   platformEnabled: boolean
  // }
}
const defaultPreferences: Preferences = {
  // theme: "dark",
  // fontSize: 1,
  defaultVolume: 1,
  theme: {
    darkTheme: true,
    monochromeTheme: false,
    roundBorders: true,
  },
  network: {
    metadataCacheFirst: true,
  },
  // soundcloud: {
  //   platformEnabled: true,
  // },
}

type ValPrefSub = [SettingsValue, string, string?]

const initialState = (() => {
  const storedPreferences = ls(preferenceLocation)
  if (storedPreferences) return updateDeep(defaultPreferences, storedPreferences)

  return defaultPreferences
})() as Preferences

declare global {
  interface Window {
    [preferenceLocation]: Preferences
  }
}
window[preferenceLocation] = initialState

export default {
  state: initialState,
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

      if (sub) applyPreference[pref] = { [sub]: val }

      const preferences = updateDeep(defaultPreferences, storedPreferences)

      ls(preferenceLocation, updateDeep(preferences, applyPreference))
    },
  },
}
