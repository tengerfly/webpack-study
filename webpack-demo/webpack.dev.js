'use strict'

const path = require('path')
const webpack = require('webpack')
// const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin()
const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
  // 单入口
  // entry: './src/index.js',
  // 多入口
  entry: {
    app: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'bundle.js'
    filename: '[name].js'
  },
  // mode: 'production',
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorWebpackPlugin()
  ],
  devServer: {
    // 基础目录
    contentBase: './dist',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 正则表达式  
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(jpg|png|jpeg|svg|gif)$/,
        // use: 'file-loader'
        // 使用url-loader来处理图片
        use: {
          loader: 'url-loader',
          options: {
            limit: 102400 // 
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
    ]
  }
}