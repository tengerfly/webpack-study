const { getAST, getDependencies, transform } = require('./parser.js')
const path = require('path')
const fs = require('fs')

module.exports = class Complier{

  constructor(options){
    const { entry, output }  = options

    this.entry = entry
    this.output = output
    this.modules = []
  }

  run(){
    const entryModule = this.buildModule(this.entry, true)
    console.log(entryModule)
    this.modules.push(entryModule)
    this.modules.map((_module) => {
      _module.dependencies.map((dependency)=> {
        this.modules.push(this.buildModule(dependency))
      })
    })
    // console.log(this.modules)
    this.emitFiles()
  }

  buildModule(filename, isEntry) {
    // 获取AST
    let ast;

    if(isEntry) {
      ast = getAST(filename)
    } else {
      // 相对路径转成绝对路径
      const absolutePath = path.join(process.cwd(), './src/', filename)
      ast = getAST(absolutePath)
    }


    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }

  }

  emitFiles() {
    // 生产的路径地址
    const outputPath = path.join(this.output.path, this.output.filename)
    
    let modules = ''

    this.modules.map((_module) => {
      modules += `'${_module.filename}': function(require, module, exports){${_module.source}},`
    })

    const bundle = `(function(modules){
      function require(filename) {
        var fn = modules[filename]
        var module = { exports: {}}

        fn(require, module, module.exports)

        return module.exports
      }
      require('${this.entry}')
    })({${modules}})`
    // 
    console.log(bundle)
    fs.writeFileSync(outputPath, bundle, `utf-8`)
  }
}