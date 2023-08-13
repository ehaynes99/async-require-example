const file = require('./file.js')

let res = {}

if (file.foo) {
  res.foo = require( './foo.js')
}

if (file.bar) {
  res.bar = require('./bar.js')
}

if (file.baz) {
  res.baz = require('./baz.js')
}

console.log('res', res)
