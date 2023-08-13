const { loadFile } = require('./module-loader.js')

const run = async () => {
  await loadFile('index.js')
}

run().catch((error) => console.error(error))
