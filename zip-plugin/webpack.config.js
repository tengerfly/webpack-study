const path = require('path')
const ZipPlugin = require('./plugins/zip-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new ZipPlugin({
      filename: 'offline'
    })
  ]
}