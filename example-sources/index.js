const file = require('./file.js')

const modules = [] 
function register(cb) {
  modules.push(cb())
}

register(() => require( './foo.js'))
register(() => require( './bar.js'))
register(() => require( './baz.js'))

let res = {}

if (file.foo) {
  res.foo = modules[0]
}

if (file.bar) {
  res.bar = modules[1]
}

if (file.baz) {
  res.baz = modules[2]
}

console.log('res', res)
