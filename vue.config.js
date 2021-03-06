module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "public/service-worker.js",
      exclude: [/_redirects/],
    },
    themeColor: "#222436",
    msTileColor: "#222436",
    name: "cloudr.app",
  },
}
