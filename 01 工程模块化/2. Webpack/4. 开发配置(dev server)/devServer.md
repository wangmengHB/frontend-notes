# devServer
在没有webpack-dev-server之前，通常前端开发会自己用nodejs写一个mock的server仅仅用于开发模拟各种api返回. 当你开发的工程多的时候，这样就会有大量的重复的并且没有什么实际用途的代码.
于是，webpack对此做了一个抽象并且支持HRM，提供了两种形式的支持：webpack-dev-server 和 webpack-dev-middleware.

如果通过node.js API 来使用 dev-sever， devServer中的选项将被忽略.
```js
new WebpackDevServer(compiler, {...devServer})
```
如果遇到问题，可以访问 http://localhost:9000/webpack-dev-server 进行查看.

# 1. 基础配置项
## host
指定使用一个host，默认是 localhost. 如果希望可以外部访问，设置为 "0.0.0.0".
## socket
The Unix socket to listen to (instead of a host).
```js
socket: 'socket'
```
## allowedHosts [array]
列出可以访问 dev server 的服务白名单. 以.开头，可以作为域名通配符. 比如， .host.com 会匹配： host.com, www.host.com, 以及任何 host.com 的子域名.
例子：
```js
allowedHosts: [
    '.host.com',
    'host2.com'
]
```
## disableHostCheck [boolean]
不推荐禁用Host检查. 因为app容易遭受 DNS rebinding attack.
## useLocalIp [boolean]
让浏览器使用本地IP打开.
## port
指定监听的端口.
## index
指定index.html的文件.
## public
当使用内联模式(inline mode)并代理 dev-server 时，内联的客户端脚本并不总是知道要连接到什么地方. 它会尝试根据 window.location 来猜测服务器的URL, 但如果失败, 你需要这样.
例如, dev-server 被代理到 nginx, 并且在 myapp.test 上可用:
```js
public："myapp.test:80"
```
## publicPath
此路径下的打包文件可在浏览器中访问.确保 publicPath如果是相对路径时，必须总是 "/" 开头和结尾.
## contentBase [boolean|string|array]
告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要.
devServer.publicPath将用于确定应该从哪里提供bundle，并且此选项优先.
默认情况下，将使用当前工作目录作为提供内容的目录.推荐使用绝对路径.
也可以从多个目录提供内容:
```js
contentBase: [
  path.join(__dirname, "public"), 
  path.join(__dirname, "assets")
]
```
## staticOptions
除了contentBase以外，可以配置更高级的选项来服务静态文件.
详细配置请参考：http://expressjs.com/en/4x/api.html#express.static
例子：
```js
staticOptions: {
  redirect: false
}
```
这个例子只在contentBase为字符串时生效.
## watchContentBase [默认false]
告诉server监视devServer.contentBase指定的文件. 文件的变更会触发页面的reload.


# 2. 网络请求相关的配置
## after [function]
在server内部的其他的middleware都执行完了以后，执行该定制的middleware函数.
## before [function]
在server内部的其他所有middleware执行之前，执行该函数. 可以用来定义定制的handler, 例如:
```js
before(app){
  app.get('/some/path', function(req, res) {
    res.json({ custom: 'response' });
  });
}
```
## https
默认情况下，dev-server 通过http提供服务. 也可以选择带有 https 的HTTP/2 提供服务.
```js
https: true
```
以上设置使用了自签名证书，但你可以提供自己的：
```js
https: {
  key: fs.readFileSync("/path/to/server.key"),
  cert: fs.readFileSync("/path/to/server.crt"),
  ca: fs.readFileSync("/path/to/ca.pem"),
}
```
此对象直接传递到Node.js HTTPS 模块.
## pfx
When used via the CLI, a path to an SSL .pfx file. 
If used in options, it should be the bytestream of the .pfx file.
## pfxPassphrase
The passphrase to a SSL PFX file.
## headers
在所有响应中添加headers内容.
```js
headers: {
  "X-Custom-Foo": "bar"
}
```
## proxy [object]
如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL会很有用.
dev-server 使用了非常强大的 http-proxy-middleware 包， 更多高级用法，请查阅： https://github.com/chimurai/http-proxy-middleware#options
在 localhost:3000 上有后端服务的话，可以这样启动代理：
```js
proxy: {
  '/api': 'http://localhost:3000'
}
```
请求到/api/user 现在会被代理到请求 http://localhost:3000/api/users
如果不想始终传递 /api， 则需要重写路径：
```js
proxy: {
  "/api": {
    target: "http://localhost:3000",
    pathRewrite: {
      "^/api": ""
    }
  }
}
```
默认情况下，不接受运行在HTTPS上，且使用了无效证书的后端服务器.
如果想接受，修改如下：
```js
proxy: {
  "/api": {
    target: "https://other-server.example.com",
    secure: false
  }
}
```
有时你不想代理所有的请求，可以基于一个函数的返回值绕过代理.(返回false或路径)
例如，对于html请求，提供页面，而对于api使用代理：
```js
proxy: {
  "/api": {
    target: "http://localhost:3000",
    bypass: function(req, res, proxyOptions) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
    }
  }
}
```
如果想代理多个特定路径到同一个target上，可以使用context属性.
```js
proxy: [{
  context: ['/auth', '/api'],
  target: 'http://localhost:3000'
}]
```


# 3. 输出日志相关的配置
## clientLogLevel [none | error | warning | info]
当使用内联模式(inline mode)时，console将显示消息. 这个选项控制日志等级.
## color [boolean]
是否开启console上的颜色.
## info
## noInfo： 不显示info，但是错误和告警仍然会显示.
## quiet [boolean]
启动quiet后, 除了初始启动信息之外的任何内容都不会被打印到控制台. 这意味着来自webpack的告警和错误在控制台不可见.
## progress (只用于命令行工具)
将运行进度输出到控制台
## stats
输出bundle性能统计信息.
```js
stats: "errors-only"
```
## overlay [boolean | object] [默认false]
当编译warning或error发生时，在浏览器上显示一个全屏的罩层.
```js
overlay: {
  warnings: true,
  errors: true
}
```




# 4. dev server 运行模式的配置
## inline [boolean]
在dev-server的两种不同模式之间切换. 默认情况下，应用程序启用内联模式. 这意味着一段处理实时重载的脚本被插入到你的bundle中，并且构建消息将会出现在控制台.
也可以使用iframe模式(inline: false), 它在通知栏下使用<iframe>标签，包含了关于构建的消息.
推荐使用模块热更新的内联模式，因为它包含来自websocket的HMR触发器.轮询模式可以作为替代方案, 但需要一个额外的入口点: 'webpack/hot/poll?1000'.
## lazy [boolean]
当启动lazy时，dev-server 只有在请求时才编译包(bundle), 这意味着webpack不会监视任何文件改动. watchOptions会在lazy模式下失效.
## filename (配合lazy模式)
可以只在某个文件被请求时编译. 例如设置为bundle.js.
只有在请求 /bundle.js 时，才会编译.


# 5. 其他配置
## historyApiFallback [boolean | object]
当使用 HTML5 History API 时，任意的 404 响应都可能需要被替换为 index.html.
通过传入以下启用:
```js
historyApiFallback: true
```
通过传入一个对象，比如使用 rewrites 这个选项，此行为可进一步地控制：
```js
historyApiFallback: {
  rewrites: [
    { from: /^\/$/, to: '/views/landing.html' },
    { from: /^\/subpage/, to: '/views/subpage.html' },
    { from: /./, to: '/views/404.html' }
  ]
}
```
当路径中使用 . ，你可能需要使用 disableDotRule：
```js
historyApiFallback: {
  disableDotRule: true
}
```

## compress [boolean]
一切服务都启用gzip压缩.
## bonjour
This option broadcasts the server via ZeroConf networking on start.

## hot
启用webpack的模块HMR特性.
## hotOnly
启用HMR特性，但是当build失败时，不使用页面刷新作为HMR的备选.

## stdin [boolean] CLI only
当stdin结束时，关闭server.

## watchOptions
与监视文件相关的控制选项.
webpack使用文件系统(file system)获取文件改动通知.在某些情况下，不会正常工作. 例如，当使用 Network File System时. 虚拟机环境也会有很多问题, 在这些情况下，请使用轮询:
```js
watchOptions: {
  poll: true
}
```
## open [boolean]
dev server 会自动打开浏览器
## openPage [string]
指定自动打开浏览器的页面.
```js
openPage: '/different/page'
```