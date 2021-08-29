module.exports = class MyPlugin{
  constructor(options){
    this.options = options
  }

  apply(compiler) {

    console.log(`this is a demo plugin`)
    console.log(`this is a demo options`, this.options)
  }
}