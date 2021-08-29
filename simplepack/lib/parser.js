// 解析AST语法树，将代码解析成AST，同时将AST转成代码


const babylon = require('babylon')
const fs = require('fs')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
// 1.将代码转成AST  babylon
// 2.分析依赖   babel-traverse
// 3.将AST转成ES5源码  babel-core

module.exports = {
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8')
    return babylon.parse(source, {
      sourceType: 'module'
    })
  },
  getDependencies: (ast) => {
    const dep = []
    traverse(ast, {
      // 用来分析import语句的
      ImportDeclaration: ({node}) => {
        // node.source.value 依赖
        dep.push(node.source.value)
      }
    })
    return dep
  },
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    })
    return code
  }
}