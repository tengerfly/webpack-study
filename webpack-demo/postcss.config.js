const autoprefixer  = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        'last 2 version', // 兼容到最近的两个版本
        '> 1%',  // 使用人数所占比
        'ios 7'
      ]
    })
  ]
}