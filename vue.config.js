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
  css: process.env.NODE_ENV === 'production' ? { extract: false, sourceMap: false } : {},
  configureWebpack: config => {
    config.externals = process.env.NODE_ENV === 'production' ? {
      vue: 'Vue',
      axios: 'axios'
    } : {}
  }
}
