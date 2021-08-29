const path = require('path')
const MyPlugin = require('./plugins/my-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new MyPlugin({
      name: 'my plugin'
    })
  ]
}