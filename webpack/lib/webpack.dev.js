/**
* 根据功能模块设计图，dev的主要内容是
* 一.代码热更新
*   1. css热更新
*   2. js热更新
*  二. sourcemap
************
*/

const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    // 基础目录
    contentBase: './dist',
    hot: true,
    stats: 'error-only',
  },
  devtool: 'cheap-source-map',
};

module.exports = merge(baseConfig, devConfig);
