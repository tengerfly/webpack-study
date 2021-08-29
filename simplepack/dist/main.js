(function(modules){
      function require(filename) {
        var fn = modules[filename]
        var module = { exports: {}}

        fn(require, module, module.exports)

        return module.exports
      }
      require('E:\study\webapck-study\simplepack\src\index.js')
    })({'E:\study\webapck-study\simplepack\src\index.js': function(require, module, exports){"use strict";

var _greeting = require("./greeting.js");

var str = (0, _greeting.greeting)('tenger');

document.write("<h1>" + str + "</h1>");},'./greeting.js': function(require, module, exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return "hello " + name;
}},})