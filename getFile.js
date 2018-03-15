const Glob = require('glob')

// let entrys
module.exports = function getFiles () {
  let filenames
  const reg = /^\.\/src\/pages\/(.+)\/index.js$/
  let files = Glob.sync('./src/pages/**/*.js')
  const _filenames = files.map(file => reg.exec(file))
  filenames = _filenames.map(file => [file[1], file[0]])
  return filenames
}
