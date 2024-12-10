'use strict'
const path = require('path')

module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      "@root": path.resolve("./src"),
      "@common": path.resolve("./src/common"),
      "@components": path.resolve("./src/components"),
    }
  }
}
