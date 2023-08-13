const { tokenize } = require('esprima')
const fetch = require('node-fetch-commonjs')

const BASE_URL =
  'https://raw.githubusercontent.com/ehaynes99/async-require-example/master/example-sources/'

const getRequires = (content) => {
  const tokens = tokenize(content)
  const iterator = tokens[Symbol.iterator]()
  const requires = []

  let token = iterator.next()
  while (!token.done) {
    if (token.value.type === 'Identifier' && token.value.value === 'require') {
      iterator.next() // skip '('
      token = iterator.next()
      if (token.value.type !== 'String') {
        throw new TypeError(`Could not load file. Non-static require: ${token.value.type} ${token.value}`)
      }
      requires.push(token.value.value.slice(1, -1))
    }
    token = iterator.next()
  }
  return requires
}

const loadFile = async (relPath) => {
  const url = new URL(relPath, BASE_URL).toString()
  const response = await fetch(url)
  const source = await response.text()
  const requireCache = {}
  await Promise.all(
    getRequires(source).map(async (file) => {
      requireCache[file] = await loadFile(file)
    }),
  )
  let module = {}
  with({ module, require: (file) => requireCache[file]}) {
    eval(source)
  }
  return module.exports
}

module.exports = {
  loadFile,
}
