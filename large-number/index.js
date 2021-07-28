if(process.env.NODE_ENV === 'production'){
  // 生产环境使用 min.js
  module.exports = require('./dist/large-number.min.js')
} else {
  module.exports = require('./dist/large-number.js')
}

// 在package.json中设置
/***
* 发布到npm
* npm  publish
*
* 在package.json script 中设置
* 
* prepublish: "webpack"
* 会在发布的时候打包并发布
*/ 