/**
* 根据功能模块设计图，ssr的主要内容是
*  一、output 的libraryTarget设置
*  二、CSS解析 ignore
*
*/
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); // 扩展
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          'ignore-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          'ignore-loader',
        ],
      },
    ],
  },
  plugins: [
  // 压缩css
    new OptimizeCSSAssetsPlugin({ // 在webpack5中报错
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    // 这里出现了一个问题就是 打包之后的search.html出现了两次react和react-dom的插入
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://lib.baomitu.com/react/17.0.2/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://lib.baomitu.com/react-dom/17.0.2/umd/react-dom.production.min.js',
          global: 'ReactDom',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
