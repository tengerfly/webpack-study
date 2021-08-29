const { getAST, getDependencies, transform } = require('./parser.js')
const path = require('path')
const ast = getAST(path.join(__dirname, '../src/index.js'))

const dep = getDependencies(ast)

const source = transform(ast)

console.log(source)