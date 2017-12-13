# 前端开发指南
## 大前端
前端是一个很广的概念，并不仅仅只是表示Web. 
前端更确切的定义应该是，数据的表现层.
一切数据的表现层，即一切的客户端，都可以归结到前端领域.
作为一名前端开发者，不应该把自己的领域仅仅只是局限于Web端的开发，应该把自己的兴趣点扩展到整个大前端. 
PC端、android端、IOS、TV、VR、嵌入式的客户端等等，都属于前端的范畴.
作为一名前端开发者, 一切客户端的问题，都应该得到我们的关注和研究.
从大前端的整体发展趋势来看，混合Web应用终将一统客户端的江湖:
1. 微软主推的PC端客户端WPF语言，从其特征上来说，完全就是一个 js + css + html 的变种.
2. MFC程序几乎消亡, 只有性能要求极高，比如图像处理客户端和大型桌游的应用可能还在使用MFC
3. 移动端Native应用和Web混合应用优劣之争的关键点是，性能和用户体验的考虑. 对于开发效率上来说，web混合应用的开发效率是远胜于Native的, 这一点是没有争议的. 随着5G的到来以及移动设备的性能提升，除了游戏以外的大部分应用, 终将会是Web混合架构.
4. 微信小程序和支付宝小程序，本质上就是一个Web app.

总而言之，大前端还是一个很有前景的方向，有很多工作都值得深入做下去, 在未来20年的软件产业中，前端开发都会有自己的一席之地.


## 前端的技术变化
过去10年，前端的发展非常快，有很多技术出现，同时也有很多技术被淘汰
已经淘汰的：
Angular1, knockout.js, ExtJs, ...
即将被淘汰的:
lodash, jquery, ...
目前最主流技术的代表是React和Vue.


## 前端开发者应该掌握的技能
传统的前端开发对于开发者的技能要求很简单：javascript，css，html.
客观来说, javascript是一门很简单的语言，上手非常容易(精通还是需要花点时间), 可以总结为上手简单，但是内容繁多。

但是仅仅只是掌握这些技能，是不能够适应现代以及未来的前端开发需求.
现代的前端开发对于开发者的要求越来越高，前端开发工作需要掌握的技能越来越多了.

单单只是从Web开发方面，对于前端开发者的要求有：
* 工程配置：webpack, gulp, rollup, babel
* 开发语言: javascript, ES6, ES7, ES8, typescript, ...
* 样式语言: css, less, sass, css in module, stylus, postcss, ...
* 基础类库: moment
* 数据结构：immutablejs
* 设计模式：Redux, vuex, thunk, middleware, mixin
* 路由管理：React-Router
* 框架: React, Vue, Angular
* 单元测试： Jasmine, Karma
* 代码质控: ESLint

特定场景的技能: WebGL, 地图, WebRTC, SVG, Canvas, webfont, ...

PC端开发，对于前端开发者的要求有：
*开发语言：c++, c#, java
*框架: CEF(Chronium Embbeded Framework)

Android和IOS端，对于前端开发者的要求有：
*开发语言: Java, Cotlin, Objective-C, Swift,
*框架: JavascriptBridge
*移动特性: liteSQL, ...

还有，server端渲染技术和nodeJS.

前端开发者应该立足于Web端开发，在深入掌握Web开发技术的基础上，再向外围去扩展自己的技能.
作为一名开发者，应该保持学习力, 跟上时代的节奏, 在牢固掌握基础知识上，学会使用各类工具和框架, 深入理解其原理.
学习总是从模仿开始的, 多动手, 先会用了，再深入去理解，知其然，并知其所以然.

## 本书概述

本书的主要目的是，列出各个前端技能点和对应的，然后将其串联为一个技术图谱，供前端开发者做参考使用.

1. 工程配置技术： webpack, babel, gulp, rollup
2. Javascript基础：
    * Closure和prototype原理 
    * ES6
    * ES7, ES8
    * typescript
3. css基础: 基本布局, sass, postcss
4. 数据结构和函数式编程: immutableJS
5. React技术栈:
    * React基础 
    * Component, PureComponent, function Component
    * Redux, thunk, immutable 单向数据流
    * React-Router
6. 单元测试和ESLint
7. 图形相关： SVG, WebGL, Canvas, 地图
8. Web应用和外壳的桥接：
    * 与C++代码的交互：CEF
    * 与IOS代码的交互: JavascriptBridge
9. 前端开源库的源码解析和欣赏:
    * jquery
    * lodash
    * redux
    * redux-thunk
    * react-router
    * react-redux

未完待续...

本书会持续更新.

***
#### 版权许可：
本书采用"保持署名--非商用"创意共享4.0许可证.

只要保持原作者署名和非商用, 您可以自由地阅读,分享和修改本书.

详细的法律条文请参见[创意共享](https://creativecommons.org/licenses/by-nc/4.0/)网站.
