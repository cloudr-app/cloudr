import { TextString } from "./types"

export const pref: TextString = {
  metadataCacheFirst: {
    name: "Metadata caching",
    desc: {
      true: "Use cached metadata before fetching new",
      false: "Always get fresh metadata (slower)",
    },
  },
  platformEnabled: {
    name: "Enable platform",
    desc: {
      true: "Platform enabled",
      false: "Platform disabled",
    },
  },
  darkTheme: {
    name: "Enable Dark Theme",
    desc: {
      true: "Easy on the eyes in dim environments",
      false: "Increased contrast in bright environments",
    },
  },
  roundBorders: {
    name: "Round Borders",
    desc: {
      true: "Images have rounded borders",
      false: "Images keep the original square shape",
    },
  },
  monochromeTheme: {
    name: "Monochrome Theme",
    desc: "Remove all colors from the UI",
  },
  defaultVolume: {
    name: "Default volume",
    desc: "Set the default volume for all platforms",
    translateValue: (v: number) => `${(v * 100).toFixed(0)}%`,
  },
}

export const preferenceLocation = "cloudr-preferences"
