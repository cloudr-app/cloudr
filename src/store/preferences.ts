import { preferenceLocation } from "@/strings"
import { SettingsValue } from "@/types"
import { ls, updateDeep } from "@/utils"
import { ActionArg } from "./store"

// ! only nest this one-deep
const defaultPreferences = {
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
    lazyLoadImages: true,
  },
  // soundcloud: {
  //   platformEnabled: true,
  // },
}

export type Preferences = typeof defaultPreferences

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
