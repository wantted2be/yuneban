let proxyObj = {}

proxyObj['/'] = {
  ws:false,  //websocket
  target:'http://localhost:8081',
  changeOrigin:true,  //发送请求头会被设置成target
  pathReWrite:{'^/':'/'},  //不重写请求地址
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj,
  },
})
