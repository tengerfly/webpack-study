/**
* 根据功能模块设计图，base的主要内容是
* 一.资源解析
*   1. 解析es6
*   2. 解析react
*   3. 解析css
*   4. 解析less
*   5. 解析图片
*   6. 解析字体
*  二. 样式增强
*    1.css前缀补齐
*    2.css px转成rem
*  三. 目录清理
*  四、多页面打包
*  五、命令行信息显示优化
*  六、错误捕获和处理
*  七、CSS提取成一个单独的文件
************
*/

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理构建产物  // 注意这里的导出
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 压缩html 自动注入css和js
const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin'); // 命令行错误捕获
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css抽离成单独的文件
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
// 多页面打包
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/); // 获取文件名称
    const pageName = match && match[1];
    entry[pageName] = entryFile; // 设置入口文件
    return htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', `${pageName}`],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.js$/, // 正则表达式
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          // 'style-loader',
          // 与style-loader是互斥的，style-loader是将css文件插在head标签里，
          // MiniCssExtractPlugin.loader是将css提取出来生成一个css文件
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          // 使用postcss-loader这是补全
          {
            loader: 'postcss-loader',
            // 兼容性设置之后不报错 但是不会自动补全
            postcssOptions: {
              // ident: 'postcss',
              plugins: () => [
                // webpack5中有兼容性问题 需要设置兼容性处理
                // css兼容性处理： postcss -> postcss-loader postcss-preset-env
                // require('postcss-preset-env')(),
                autoprefixer({
                  browsers: [
                    'last 2 version', // 兼容到最近的两个版本
                    '> 1%', // 使用人数所占比
                    'ios 7',
                  ],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|jpeg|svg|gif)$/,
        // use: 'file-loader'
        // 使用url-loader来处理图片
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
            limit: 1024, //
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    // css单独提取出来
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorWebpackPlugin(),
    function ErrorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          process.exit(1);
        }
      });
    },
    ...htmlWebpackPlugins,
  ],
  // 设置stats
  satas: 'errors-only',
};
