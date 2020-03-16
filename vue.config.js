const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  outputDir: "dist",
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        // copy custom static assets (e.g., Netlify _redirects)
        {
          from: path.resolve(__dirname, "./distRoot"),
          to: "",
          ignore: [".*", "*.MD"]
        }
      ])
    ]
  },
  "transpileDependencies": [
    "vuetify"
  ]
}