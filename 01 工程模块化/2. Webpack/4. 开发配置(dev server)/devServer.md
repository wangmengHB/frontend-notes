# devServer
在没有webpack-dev-server之前，通常前端开发会自己用nodejs写一个mock的server仅仅用于开发模拟各种api返回. 当你开发的工程多的时候，这样就会有大量的重复的并且没有什么实际用途的代码.
于是，webpack对此做了一个抽象并且支持HRM，提供了两种形式的支持：webpack-dev-server 和 webpack-dev-middleware.

如果通过node.js API 来使用 dev-sever， devServer中的选项将被忽略.
```js
new WebpackDevServer(compiler, {...devServer})
```
如果遇到问题，可以访问 http://localhost:9000/webpack-dev-server 进行查看.

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

## allowedHosts [array]
列出可以访问 dev server 的服务白名单. 以.开头，可以作为域名通配符. 比如， .host.com 会匹配： host.com, www.host.com, 以及任何 host.com 的子域名.
例子：
```js
// this achieves the same effect as the first example
// with the bonus of not having to update your config
// if new subdomains need to access the dev server
allowedHosts: [
    '.host.com',
    'host2.com'
]
```


## bonjour
This option broadcasts the server via ZeroConf networking on start.

## clientLogLevel [none | error | warning | info]
当使用内联模式(inline mode)时，console将显示消息. 这个选项控制日志等级.
## color [boolean]
是否开启console上的颜色.


## compress [boolean]
一切服务都启用gzip压缩.


## contentBase [boolean|string|array]
告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要.
devServer.publicPath将用于确定应该从哪里提供bundle，并且此选项优先.
默认情况下，将使用当前工作目录作为提供内容的目录.推荐使用绝对路径.
也可以从多个目录提供内容:
```js
contentBase: [path.join(__dirname, "public"), path.join(__dirname, "assets")]
```

## disableHostCheck [boolean]
不推荐禁用Host检查. 因为app容易遭受 DNS rebinding attack.

## filename
## headers
## historyApiFallback
## host
## hot
## hotOnly
## https
## index
## info
## inline
## lazy
## noInfo
## open
## openPage
## overlay
## pfx
## pfxPassphrase
## port
## proxy
## progress
## public
## publicPath
## quiet
## setup
## socket
## staticOptions
## stats
## stdin
## useLocalIp
## watchContentBase
## watchOptions
