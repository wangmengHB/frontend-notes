# 前端开发笔记 ( always in Progress )

# 前言说明
这个仓库是我个人前端开发笔记总结，内容比较凌乱没有章法，但是会持续更新。  
观点不一定正确，感兴趣可以看看，不感兴趣请直接无视。 

本人非计算机科班出身，当过高中物理老师，爬过电线杆装摄像头，..., 后转行当职业程序员，从事软件开发行业已经是第十个年头了。这十年时间，经历过不少公司. 其中，我最喜欢的公司还是东芝医疗系统（中国）有限公司，已被佳能收购。感觉个人的开发技术突飞猛进是开始于东芝，那里环境很宽松，博士很多，是一个真正培养人的地方。也就是在那里开始第一次接触前端，当时用的前端框架是 ExtJS，主要是医学影像工作站方向。    

目前就职于阿里巴巴（这是一个让人一言难尽的地方），目前专注于前端的图形图像视频多媒体处理领域，正在努力转型成为一个专业的多媒体工程师，前端只是一个应用场景。多媒体领域很深，正在努力学习中。。。

# 前端的核心竞争力
前端是一个内容很杂门槛很低的领域，入门很简单，但要做精深又的确很难。
前端没有任何秘密，只要肯深入，总会找到解决方案。
前端是自带产品属性，核心竞争力不是在于做基础研究的深入，而是需要眼光敏锐，动作迅速，能够快速把既有技术攒成一个产品。 
手快眼快才是前端工程师的核心竞争力，至于其他的都不过是时间的积累。    
另外，这几年有两个重要的趋势就是：
1. tensorfow.js 可以很方便地把模型应用到端侧，从而让端侧也具备有一定的算法能力。  
2. webassembly 逐渐流行，可以把一些常见的算法库移植到前端直接使用。       


# 前端学习标准资料
除了买那几本标准的 《primer》以及算法设计模式相关英文版教材以外，我是不建议再去花钱买什么书籍，大部分都是一些所谓的专家凑字数的产品，大段地贴代码，没有什么营养，英文版的书籍一般质量较高。  
前端的标准学习网站是： MDN，HTML5 rocks, CSS tricks 那几个网站。  
框架的学习看官方的文档即可。（真没必要买书）      
更进一步更深入的学习是，看 github 源码。  
发现开源项目 bug，不要算了，顺手给作者提几个 PR，就非常有机会成为开源项目贡献者。 这件事情其实很简单。（我个人就蹭了一个 OpenCV 的 PR， 被收录）。


## 什么是前端
今天的前端开发已经完全不同于10年前的web开发，今天的前端越来越像是一各广义的概念：   
以web开发为基础，把触角扩展到了所有的端：web端/跨平台桌面端/移动端/小程序/IoT等（还有服务端/cli/插件等）.  
几乎所有的客户端里都有可能会涉及到前端开发内容， 一切客户端所关注的问题同样也是前端关注的问题。  

这里面经常会涉及到一些讨论，web 开发是否会取代 移动端 native 的开发？  
我个人认为不会，基于性能问题/安全问题以及平台商的因素，native 的程序未来仍然会长期存在。
对于很多 app 来说，只是简单地嵌入一个 webview 或浏览器来解决所有问题并不合适，也不符合厂商的利益。  

但是 native 开发和 web 开发合作的部分会越来越多，越来越深入。这一点是不可否认的。  

## 前端要解决问题
本质上来看，前端需要解决的事情只有两个：
1. 数据展示问题：如何让数据以最被用户接受的方式展示给用户。   
2. 数据编辑问题：如何为用户提供有效的工具，对数据进行编辑，数据在这里只是一个简单的抽象，它可以是图片/声音/视频/文本/文档/动画等等任何形式。    
3. 专业工作站问题：医学影像阅片工作站等   
4. 多媒体处理和编辑问题     

## 前端的应用类型


从生产的角度出发，前端开发的工作流，从设计到开发，再到发布上线运营，再到数据监控，可能会遇到以下一些列的问题：
1. 开发基础设施建设：
* 搭建持久化无缓存服务，用于应用的升级
* 搭建cdn服务，并打通 git 和 cdn 之间的连接

2. 设计阶段：
* 设计原型样例是否可以直接转换成代码

3. 开发阶段：
* 模块化工程化方案，和基础框架选型, 多端的差异行考虑
* 常规的组件设计，页面布局，和路由设计
* 数据的可视化问题
* 视频的操作问题，视频资源分片，弹幕，直播等
* 声音的处理，声音的合成，音频的视觉可视化
* 复杂图形和图像处理，VR视频，VR地图
* 在线编辑器，在线IDE，在线world，excel等。

4. 发布阶段：
* （被动）用户使用埋点数据统计方案
* （主动）用户反馈方案，比如录屏反馈
*  cdn发布方案
*  PWA缓存方案
*  版本更新升级方案


## 前端开发者需要具备的能力：
1. 基础知识 (js/ts，css/scss/less, html/pug/jsonml/makdown)
2. 基础框架技能  (react, redux, saga, vue, vuex, router, ssr)
3. 模块化和工程能力 （git，npm，babel，webpack，puppeter, 测试和自动化）
4. 设计能力和环境知识 （设计模式，http，https，websocket，worker，cdn等）  
注：(非必需) 在处理多端解决方案问题，还需要掌握一定的原生开发技能。


## 前端开发者需要解决的问题
5. 传统的页面或组件的实现 (vue, react)
6. web应用结构设计 (前端路由, 后端路由, ssr, pwa, 状态管理)
7. 模板层部分（backend for frontend: nodejs, koa, egg）
8. 数据可视化 (各类图表，主要使用SVG)
9. 图像的处理 (全景图和VR等，主要使用canvas 2d 和 webgl)
10. 声音的处理
11. 视频的处理: 播放和编辑预览
12. 地图的解决方案
13. 移动端和小程序 （react-native，weex，wepy）
14. 用户行为收集和统计问题
15. 用户反馈收集问题（录屏反馈）
16. 跨平台的桌面端 （Electron）
17. node工具开发


## 前端团队建设
成体系化建设。    
团队建设目标分为两个维度：  
1. 基础目标： 更快，更少，更稳。（更快的研发响应，更少的研发投入，降低人员流动性影响。）  
* 统一代码规范，统一代码风格，统一的 lint 工具，统一的管控流程。   
* 统一的架构框架， 不同类型的项目，应该由对应类型项目的统一模板工具生成。         
* 对于常规的项目，人员流动的影响必须控制在最长1天内完成补位。      
2. 价值目标： 更好，更多，更强。  （提供更好更多更强的基础能力为产品服务）  

### 1. 基础设施建设
##### 1.1. 基础组件库和函数库 （可对外开放）：
* 安全性： 对所有使用到的第三方 npm 包有管理和控制。  
* 开放性： 按照先单元开发，后集成开发的思路，收敛能力到基础组件库。 
形成一个开放机制， 让团队养成先单元开发，后集成开发的习惯，单元开发的成果可以收录到基础组件库中，并不一定需要专门的团队来做基础组件的日常开发。   
* 高质量： 高覆盖率的 UT， 完善的输出文档，丰富的 demo 示例     
* 易用性： 搭建站点，支持搜索，方便开发者快速找到所需要组件和函数库    
* 稳定性： 基础组件的代码质量等级要求是最高等级，它的稳定性高于一切。    
对于高度依赖API的组件如地图类组件，它的本质也是基础组件库。 

##### 1.2. 业务组件库建设（包含 API） （主要是对内） 
业务组件依赖基础组件。  
由于业务组件的中的 API 不确定性，需要前后配置，等API彻底稳定，可以迁移到基础组件库中。  

##### 1.3. 基础框架集的管理和建设   
1. 对业务中所有涵盖的项目类型进行总结概括，提炼出每种类型相对最优的模板，提供统一的 cli 工具， 所有的项目必须由该 cli 工具初始化选择模板生成。 
对团队内的项目框架进行约束收敛管理。 
2. 统一的数据监控方案。     

### 2. 专业的web工具集建设
这类工具主要适用 MVC 的模式，react/vue 之类 MVVM 模型不适合用在这里。   
文本编辑器，代码编辑器，word编辑器，excel编辑器，ppt编辑器，pdf编辑器， photoshop编辑器, gif编辑器等等. 
要求：
良好的设计，可以容易地集成到其他项目。     
支持协同工作的扩展。    

### 3. 可视化工具集建设 （canvas svg 库）


### 4. 产品价值方向
 
2. 用户体验的创新突破     
3. 新技术的产品侧应用     


## 本文概述

本文的主要目的是,列出各个前端技能点和对应的,然后将其串联为一个技术图谱,供前端开发者做参考使用. 
第一部分：知识技能部分, 第1-4章。  
第二部分：前端的问题域, 第5-16章。  
第三部分：前端开源项目源码分析，第17章。  


未完待续...

本文会持续更新.

***
#### 版权许可:
本书采用"保持署名--非商用"创意共享4.0许可证.

只要保持原作者署名和非商用, 您可以自由地阅读,分享和修改本书.

详细的法律条文请参见[创意共享](https://creativecommons.org/licenses/by-nc/4.0/)网站.
