# ant 前端技术栈
## 1. roadhog: react-dev-utils, create-react-app 的强化版本
https://github.com/sorrycc/roadhog
### roadhog 特点：
1. 内置 css-modules， babel， postcss， HMR 等
2. JSON 格式的 webpack 配置
3. 基于jest的test，包括UI测试（基于 enzyme）
4. mock
在 .roadhogrc.mock.js 中配置：
```js
export default {
    // 支持值为 Object 和 Array
    'GET /api/users': { users: [1, 2]},
    // GET POST 可省略
    '/api/users/1': {id: 1},
    // 支持自定义函数, API 参考 express @4
    'POST /api/users/create': (req, res) => { res.send('OK') }
}
```
约定 public 目录下的文件会在 dev 和 build 时自动copy到 ./dist 目录下。
可以在 public 下存放 favicon, iconfont, html 以及 html 中引用到的资源文件。

### roadhog 配置
roadhog 的 webpack 部分功能是基于 af-webpack (也是蚂蚁工具) 实现的.
在工程根目录下配置 .webpackrc.js (或 .webpackrc) 文件：
```js
export default {
    "externals": {"react": "window.React"}
}
```
其他的配置项，包含有 babel，antd（theme），i18n，以及其他的。
详细的内容，请查看：https://github.com/sorrycc/roadhog


## 2. dva: redux + redux-saga + react-router 的封装版
https://dvajs.com/





## 3. umi： next.js（ vue 的版本是 nuxt.js ） 的加强版，主要解决的问题是简化路由配置。
https://umijs.org/zh/guide/
主要用途是简化多页面的 react 应用开发，可以简单理解为 umi = roadhog + router
### 特点：
1. 内置 react，react-router 等
2. 类似 next.js 且功能完备的路由约定
3. 一键兼容 IE9， 基于 umi-plugin-polyfills
4. 其他
部署模式：site， 离线包， chair， sofa， assets




