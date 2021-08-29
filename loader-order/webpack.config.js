const path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          path.resolve('./loaders/a-loader'),
          path.resolve('./loaders/b-loader')
        ]
      }
    ]
  }
}