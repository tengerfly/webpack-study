module.exports = {
  parser: 'babel-eslint', // 解析器
  extends: 'airbnb-base', // 继承 可以是数组
  env: { // 设置全局变量
    browser: true,
    node: true,
  }
};
