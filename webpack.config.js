var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./lib/entry.js",
  output: {
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js"]
  }
};
