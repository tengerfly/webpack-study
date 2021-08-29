
const JSZip = require('jszip')
const path = require('path')
const zip = new JSZip()
const RawSource = require('webpack-sources').RawSource

module.exports = class ZipPlugin{
  constructor(options){
    this.options = options
  }

  apply(compiler) {
    // 异步的钩子
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback)=> {
      const folder = zip.folder(this.options.filename) 

      for(let filename in compilation.assets) {
        // console.log(compilation.assets[filename])
        const source = compilation.assets[filename].source()

        folder.file(filename, source)
        // console.log(source)
      }

      zip.generateAsync({
        type: 'nodebuffer'
      }).then((content)=> {
        // console.log(content)
        const outputPath = path.join(
          compilation.options.output.path,
          this.options.filename+'.zip'
        )

        const outputRelativePath = path.relative(
          compilation.options.output.path,
          outputPath
        )

        compilation.assets[outputRelativePath] = new RawSource(content)

        callback()
      })

    })
  }
}