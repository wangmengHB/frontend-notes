# 前端开发指南 (in Progress)
## 什么是前端
前端是一个广义的概念, 一切数据的表现层（即客户端），都可以归结为前端，一切客户端的问题,都是前端开发者应该关注和研究的问题.
前端的领域，并不仅仅只局限于web，移动客户端，跨平台桌面端，(微信和支付宝)小程序等等，都属于前端领域。
web是前端领域最基础和核心的部分。 


## js（或ts）的多端解决方案
1. 跨平台的桌面端解决方案：Electron
2. 移动端的解决方案：Weex, react-native
3. 前端应用框架：Vue, React
4. 微信和支付宝小程序的框架: wepy, mpvue

## 前端开发者应该掌握的技能领域
传统的web开发对于开发者的技能要求很简单:javascript,css,html.
客观来说, javascript是一门很简单的语言,上手非常容易(精通还是需要花点时间), 总之上手简单,但是内容繁多。
但是仅仅只是掌握这些技能,是不能够适应现代以及未来的前端开发需求.
现代的前端开发对于开发者的要求越来越高,前端开发工作需要掌握的技能越来越多.

### 1. 语言基础
* javascript, ES6(next), typescript
* css, scss, stylus, postcss
* html, pug(jade)
* 原生程序开发语言: c++, c#, java, coltin, objective-c, swift 

### 2. 框架和设计模式
* React, Vue, 其他等(angular, ember, backbone, extjs)
说明：并不需要学会所有框架，重点是理解一个通用前端程序应该如何结构划分和设计. 
框架可以不一样，但是设计原理和思路都是相通的.
* Flux, Redux, Vuex, immutable.js，thunk, middleware, mixin
* Functional Reactive Programming

### 3. 工程模块化和测试
* NPM, webpack, babel-loader, vue-loader
* EsLint, Jest, Puppeter


## web的种类：
1. spa
2. 多页面应用
3. ssr

### 4. 多端应用
* web端：Mobile-First, Progressive Web Application(离线优先)
* 移动端: react native, weex, javascriptBridge
* 小程序端: wepy, mpvue
* 桌面端： Electron
* 服务端： nodejs, express, koa
说明：在开发混合应用时，还有一个重要的问题，原生应用特性研究.

### 5. 特定的具体问题领域
* webRtc, svg，webgl(canvas), geolocation, webfont, WebWorker, multi-media, animation
说明：这些特定的问题并不是仅仅简单的只对应一个html元素或一个api，其内容是非常深的，
比如，webgl并不只是一个canvas元素那么简单，会有很多很厚的书对其进行的讲解.

## 本文概述

本文的主要目的是,列出各个前端技能点和对应的,然后将其串联为一个技术图谱,供前端开发者做参考使用. 
第一部分：技术基础, 第1-6章.
第二部分：前端框架React和Vue入门, 第7-9章.
第三部分：前端应用：第10-12章.
第四部分：前端开源源码解析：第13章.

1. 工程配置技术:
    * npm
    * webpack 
    * 工程自动化和部署
2. Javascript部分:
    * 闭包原理
    * 原型链原理
    * 多变的this 
    * ES6, ES7, ES8, ES.next
    * typescript
3. css部分: 
    * 选择器和继承
    * 基本布局
    * sass/postcss/stylus
    * html模块语言：pug
4. 数据结构和设计模式
5. 浏览器和Http协议
6. 图形相关

7. React专题:
    * React基础：Component, PureComponent, function Component
    * Redux(单向数据流), thunk, immutable 
    * React-Router
8. Vue专题
9. 设计一套UI组件
10. 微信和支付宝小程序
11. 移动端开发
    * PhoneGap
    * React Native
    * Weex
12. 桌面端解决方案：Electron
13. 前端开源库的源码解析


未完待续...

本文会持续更新.

***
#### 版权许可:
本书采用"保持署名--非商用"创意共享4.0许可证.

只要保持原作者署名和非商用, 您可以自由地阅读,分享和修改本书.

详细的法律条文请参见[创意共享](https://creativecommons.org/licenses/by-nc/4.0/)网站.
