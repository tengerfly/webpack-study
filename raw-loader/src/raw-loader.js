
const fs = require('fs')
const path = require('path')

module.exports = function (source) {

  // 关闭缓存
  this.cacheable(false)

  const callback = this.async()

  const json = JSON.stringify(source)
  .replace(/\u2028/g, '\\u2028') // 安全处理
  .replace(/\u2029/g, '\\u2029')

  fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, data)=> {
    if(err){
      callback(err, '')
    }
    callback(null, data)
  })

  // return `export default ${json}`
  // this.callback(null, json)
}