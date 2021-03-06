const CompressionPlugin = require('compression-webpack-plugin')

'use strict'
module.exports = {
  devServer: {
    port: '8080', // 代理端口
    proxy: {
      '/user-api': {
        target: 'http://42.48.104.46:15012', // 服务器 api地址
        changeOrigin: true, // 是否跨域
      },
      '/group1': {
        target: 'http://42.48.104.46:15012', // 服务器 api地址
        changeOrigin: true // 是否跨域
      },
    }
  },
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css$/,
          threshold: 10240
        })
      )
      config.externals = {
        vue: 'Vue',
        axios: 'axios'
      }
    }
  }
}
