const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  mode: 'none',
  entry: {
    "large-number": "./src/index.js",
    "large-number.min":"./src/index.js"
  },
  output: {
    filename: `[name].js`,
    library: 'largeNumber', // 打包名称
    libraryTarget: 'umd', // 打包格式
    libraryExport: 'default'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      })
    ]
  }
}