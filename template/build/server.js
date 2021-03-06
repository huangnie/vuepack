'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const fse = require('fs-extra')
const webpackConfig = require('./webpack.dev')
const config = require('./config')

const app = express()

const port = config.port
webpackConfig.entry.client = [
  `webpack-hot-middleware/client{{#electron}}?path=http://localhost:${port}/__webpack_hmr{{/electron}}`,
  webpackConfig.entry.client
]
{{#electron}}

webpackConfig.output.publicPath = `http://localhost:${port}/`
{{/electron}}

const compiler = webpack(webpackConfig)

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
})
app.use(devMiddleWare)
app.use(require('webpack-hot-middleware')(compiler))

const mfs = devMiddleWare.fileSystem
const file = path.join(webpackConfig.output.path, 'index.html')

devMiddleWare.waitUntilValid(() => {
  const html = mfs.readFileSync(file)
  fse.ensureDirSync(path.dirname(file))
  fs.writeFile(file, html, 'utf8', err => {
    if (err) console.log(err)
  })
})

app.get('*', (req, res) => {
  devMiddleWare.waitUntilValid(() => {
    const html = mfs.readFileSync(file)
    res.end(html)
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
