const { tokenize } = require('esprima')
const fetch = require('node-fetch-commonjs')

const BASE_URL =
  'https://gist.githubusercontent.com/ehaynes99/79cfbf2250a2a0546008dbfa23faa041/raw/d7ebd9d7f9c7e3f472ff5d6ed75c1e8c9da8954c/'

const getRequires = (content) => {
  const tokens = tokenize(content)
  const iterator = tokens[Symbol.iterator]()
  const requires = []

  let token = iterator.next()
  while (!token.done) {
    if (token.value.type === 'Identifier' && token.value.value === 'require') {
      token = iterator.next()
      if (token.value.type === 'Punctuator' && token.value.value === '(') {
        token = iterator.next()
        if (token.value.type !== 'String') {
          throw new TypeError(`Could not load file. Non-static require: ${token.value.type} ${token.value}`)
        }
        console.log('token', token.value.value)
        requires.push(token.value.value)
      }
    }
    token = iterator.next()
  }
  return requires
}

const loadFile = async (relPath) => {
  const url = new URL(relPath, BASE_URL).toString()
  console.log('file:', relPath, url)
  const response = await fetch(url)
  const source = await response.text()
  console.log(relPath, source)
  const requires = getRequires(source)
  const requireCache = {}
  await Promise.all(
    requires.map(async (file) => {
      requireCache[file] = await loadFile(file)
    }),
  )
  let module
  with({ require: (file) => requireCache[file] }) {
    module = eval(source)
  }
  return module.exports
}

module.exports = {
  loadFile,
}
