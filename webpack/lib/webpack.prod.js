/**
* 根据功能模块设计图，prod的主要内容是
* 一. 代码压缩
* 二. 文件指纹
* 三. Tree Shaking webpack已经内置
* 四、Scope Hoisting webpack已经内置
* 五、速度优化  基础包CDN
* 六、体积优化  代码分割
************
*/

const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); // 扩展
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
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
