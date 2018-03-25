/**
 * 改变lodash的root变量，适配小程序
 */

const fs = require('fs')

let wetypejs = fs.readFileSync('dist/wetype.js', 'utf8')

if (wetypejs) {
    wetypejs = wetypejs.replace(/var\sroot\s?=\s?(.+?);/, (match, $) => {
        return `var root = {
   Array: Array,
   Date: Date,
   Error: Error,
   Function: Function,
   Math: Math,
   Object: Object,
   RegExp: RegExp,
   String: String,
   TypeError: TypeError,
   setTimeout: setTimeout,
   clearTimeout: clearTimeout,
   setInterval: setInterval,
   clearInterval: clearInterval
};`
    })
    fs.writeFileSync('dist/wetype.js', wetypejs, 'utf8')
    console.log('完成')
}
