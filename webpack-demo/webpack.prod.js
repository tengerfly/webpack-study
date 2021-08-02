const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
// const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin()  // 热更新模块
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css抽离成单独的文件
// const OptimizeCSSAssetsPlugin =  require('optimize-css-assets-webpack-plugin')  // 压缩css
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 压缩html 自动注入css和js
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理构建产物  // 注意这里的导出
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin')
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/); // 获取文件名称
    const pageName = match && match[1];
    entry[pageName] = entryFile; // 设置入口文件
    htmlWebpackPlugins.push(
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
  // 单入口
  // entry: './src/index.js',
  // 多入口
  entry,
  // entry: {
  //   app: './src/index.js',
  //   search: './src/search.js'
  // },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'bundle.js'
    filename: '[name]-[chunkhash:8].js',
  },
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
    }),
    new FriendlyErrorWebpackPlugin(),
    // new OptimizeCSSAssetsPlugin({ // 在webpack5中报错
    //   assetNameRegExp:/\.css$/g,
    //   cssProcessor:require('cssnano')
    // })
    ...htmlWebpackPlugins,
    // 一个页面对应一个
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '/public/search.html'),
    //   filename: 'search.html',
    //   chunks: ['search'],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false
    //   }
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '/public/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false
    //   }
    // }),
    new CleanWebpackPlugin(),
    // 这里出现了一个问题就是 打包之后的search.html出现了两次react和react-dom的插入
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://lib.baomitu.com/react/17.0.2/umd/react.production.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://lib.baomitu.com/react-dom/17.0.2/umd/react-dom.production.min.js',
    //       global: 'ReactDom'
    //     }
    //   ]
    // })
  ],
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     // 抽取公共包
    //     // commons: {
    //     //   test: /(react|react-dom)/,
    //     //   name: 'vendors',
    //     //   chunks: 'all'
    //     // }
    //   }
    // }
    // 抽取公共组件
    splitChunks: {
      minSize: 1000, // 只要引用就被抽取
      cacheGroups: {
        // 抽取公共组件
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2, // 最小引用次数
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 正则表达式
        use: [
          'babel-loader',
          // 'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [ // 执行顺序是从右到左的  现将css文件解析成css 然后再将css传递给style-loader
          // 'style-loader',
          MiniCssExtractPlugin.loader, // 与style-loader是互斥的，style-loader是将css文件插在head标签里，MiniCssExtractPlugin.loader是将css提取出来生成一个css文件
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
          // {
          //   loader:'postcss-loader',
          //     // 兼容性设置之后不报错 但是不会自动补全
          //     postcssOptions: {
          //       // ident: 'postcss',
          //       plugins: ()=> [
          //         // webpack5中有兼容性问题 需要设置兼容性处理
          //         // css兼容性处理： postcss -> postcss-loader postcss-preset-env
          //         // require('postcss-preset-env')(),
          //         require('autoprefixer')({
          //           browsers: [
          //             'last 2 version', // 兼容到最近的两个版本
          //             '> 1%',  // 使用人数所占比
          //             'ios 7'
          //           ]
          //         })
          //       ]
          //     },
          //     // 以下设置报错
          //     // plugins: ()=> [
          //     //   require('autoprefixer')({
          //     //     browsers: [
          //     //       'last 2 version', // 兼容到最近的两个版本
          //     //       '> 1%',  // 使用人数所占比
          //     //       'iOS 7'
          //     //     ]
          //     //   })
          //     // ]
          //   }
          // }

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
  // sourcemap
  // devtool: 'eval' // 将sourcemap打包到js中
  // devtool: 'source-map' // 将sourcemap单独生产文件
  // 设置stats
  satas: 'errors-only'
  
};
