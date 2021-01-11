# 前端开发笔记

# 前言
这个仓库主要是个人前端开发笔记和文章总结，仅供参考。   
随着技术的发展和时间的推移，我们经常会之前的一些认知会发生变化，有些甚至是完全推翻颠覆。  
所以，不能保证内容的绝对权威性和正确性，仅仅只是提供一些参考和视角，当然，一有时间我会尽量及时更新文章的内容，删掉一些过时的东西。   
对于前端领域新入行的朋友，我的个人建议还是买几本权威的书籍系统地学习一下，认真研读 MDN 文档，多动手多尝试。网上的文章，只能作为一个辅助学习手段，通常它们只解决 HOW 的问题，不能解决 WHY 的问题。          

从事软件开发行业，已经有10个年头了，写总结文章也逐渐发展成个人的一大爱好。    
我始终认为，如果不能够把一个问题或者解决方案，清晰地用文字表达出来，多少说明自己对问题的理解并没有自己想象中的那么透彻。   
坚持学习，坚持写作，活到老，学到老，写到老, 与大家共勉。   

鉴于 markdown 文档处理图片非常不方便，部分整理好的文章会发在我的知乎专栏上 [前端咖啡馆](https://www.zhihu.com/column/c_1316801491576532992)。

## 知乎文章
1. [Piece Table 数据结构 （文本编辑器中的无名英雄） `[译]`](https://zhuanlan.zhihu.com/p/268726520)         
2. [VS Code 中的 Text Buffer 的重新实现 `[译+解读]`](https://zhuanlan.zhihu.com/p/268739650)        
3. [机器学习在前端的应用（一）（上传视频推荐封面图功能解析）](https://zhuanlan.zhihu.com/p/268833642)       
4. [机器学习在前端的应用（二）(口红试色功能解析)](https://zhuanlan.zhihu.com/p/322050042)       


# 已经整理好的文章集：


08. 图像和视觉专题      
    1. 基本图形绘制       
        1. [canvas 的核心特性](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/1.%20%E5%9F%BA%E6%9C%AC%E5%9B%BE%E5%BD%A2%E7%BB%98%E5%88%B6/1.%20canvas%20%E6%A0%B8%E5%BF%83%E7%89%B9%E6%80%A7.md)      
        2. [渐变和 pattern 以及高级画笔原理](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/1.%20%E5%9F%BA%E6%9C%AC%E5%9B%BE%E5%BD%A2%E7%BB%98%E5%88%B6/2.%20%E6%B8%90%E5%8F%98%E5%92%8C%20pattern%20%E4%BB%A5%E5%8F%8A%E9%AB%98%E7%BA%A7%E7%94%BB%E7%AC%94%E5%8E%9F%E7%90%86.md)     
        3. [绘制样式和状态](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/1.%20%E5%9F%BA%E6%9C%AC%E5%9B%BE%E5%BD%A2%E7%BB%98%E5%88%B6/3.%20%E7%BB%98%E5%9B%BE%E6%A0%B7%E5%BC%8F%E5%92%8C%E7%8A%B6%E6%80%81.md)     
        4. [变换状态 transform](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/1.%20%E5%9F%BA%E6%9C%AC%E5%9B%BE%E5%BD%A2%E7%BB%98%E5%88%B6/4.%20%E5%8F%98%E6%8D%A2%E7%8A%B6%E6%80%81%20transform.md)              
              
    2. 2D 图形的统一表示
        1. [SVG 中的 2D 图形定义](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/2.%202D%E5%9B%BE%E5%BD%A2%E7%9A%84%E7%BB%9F%E4%B8%80%E8%A1%A8%E7%A4%BA/1.%20SVG%20%E4%B8%AD%202D%20%E5%9B%BE%E5%BD%A2%E7%9A%84%E5%AE%9A%E4%B9%89.md)
        

    8. 3D 图形
        1. 空间点和矩阵
            1. [空间点和投影](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/8.%203D%E5%9B%BE%E5%BD%A2/1.%20%E7%A9%BA%E9%97%B4%E7%82%B9%E5%92%8C%E7%9F%A9%E9%98%B5/1.%20%E7%A9%BA%E9%97%B4%E7%82%B9%E5%92%8C%E6%8A%95%E5%BD%B1.md)
            2. [矩阵和矢量](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/8.%203D%E5%9B%BE%E5%BD%A2/1.%20%E7%A9%BA%E9%97%B4%E7%82%B9%E5%92%8C%E7%9F%A9%E9%98%B5/2.%20%E7%9F%A9%E9%98%B5%E5%92%8C%E7%9F%A2%E9%87%8F.md)
        2. webgl 着色器
            1. [顶点着色器](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/8.%203D%E5%9B%BE%E5%BD%A2/2.%20webgl%20%E7%9D%80%E8%89%B2%E5%99%A8/1.%20%E9%A1%B6%E7%82%B9%E7%9D%80%E8%89%B2%E5%99%A8.md)    
            2.[着色器初始化](https://github.com/wangmengHB/frontend-notes/blob/master/08.%20%E5%9B%BE%E5%83%8F%E5%92%8C%E8%A7%86%E8%A7%89%E4%B8%93%E9%A2%98/8.%203D%E5%9B%BE%E5%BD%A2/2.%20webgl%20%E7%9D%80%E8%89%B2%E5%99%A8/3.%20%E7%9D%80%E8%89%B2%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96.md)



12. 编辑器专题        
    1. 文档 Text Buffer 数据结构      
        1. [piece table [译]](https://github.com/wangmengHB/frontend-notes/blob/master/12.%20%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%93%E9%A2%98/1.%20%E6%96%87%E6%A1%A3%20Text%20Buffer%20%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/1.%20piece%20table%20%5B%E8%AF%91%5D.md)      
                
        3. [VS Code 中 Text Buffer 的重新实现[译+解读]](https://github.com/wangmengHB/frontend-notes/blob/master/12.%20%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%93%E9%A2%98/1.%20%E6%96%87%E6%A1%A3%20Text%20Buffer%20%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/3.%20VS%20Code%20%E4%B8%ADText%20Buffer%20%E7%9A%84%E9%87%8D%E6%96%B0%E5%AE%9E%E7%8E%B0%5B%E8%AF%91%5D.md)        



## 浏览器即是操作系统       
对于前端开发来说，可以将“浏览器”理解为操作系统。 这里的浏览器还是广义的概念，包括：移动端的 webview，跨平台的 Electron，小程序环境， 甚至还有 IoT 设备中的界面系统。 在某种意义上，把前端理解为一种广义上的的客户端是准确的。   
在未来相当长的时间内，前端开发和传统的 native 开发会一直互相配合相辅相成。 当然，如果未来前端的性能与 native 之间的差距缩小到可以接受的范围内，前端开发会逐渐取代 native 开发。     





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
3. 浏览器的基础知识  
4. 模块化和工程能力 （git，npm，babel，webpack，puppeter, 测试和自动化）
5. 设计能力和环境知识 （设计模式，http，https，websocket，worker，cdn等）  
注：(非必需) 在处理多端解决方案问题，还需要掌握一定的原生开发技能。


## 前端的几大问题域： 
6. UI 组件页面基础问题  
7. 数据可视化问题 （渲染只是最简单的部分，核心的是数值计算和坐标计算，图表数据抽象 ）
8. 图形图像视觉问题 ( canvas2D, webgl, svg, 颜色，视觉等 ) 
9. 音视频处理问题 （音频可视化， 音频处理合成， 视频编解码合成 等）
9. 图像的处理 (全景图和VR等，主要使用canvas 2d 和 webgl)
10. 机器学习的端侧应用 (tensorflow.js)
11. webassembly 应用  
12. 编辑器的设计 （文本，代码，文档 等编辑器）
13. 多端问题
14. 插件开发问题
15. nodejs 专题



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



#### 2021 TODO LIST：

文章工作：  

机器学习在前端的应用系列：
1. 机器学习在前端的应用（三）（视频会议中的虚拟背景功能解析）       
2. 机器学习在前端的应用（四）（姿势操控web游戏功能解析）        
3. 机器学习在前端的应用（五）（图片卡通化风格迁移功能解析）         
4. 机器学习在前端的应用（六）（OCR 在 web 文档中的应用）              
5. 机器学习在前端的应用（七）（TBD）
5. 机器学习在前端的应用（八）（TBD）
5. 机器学习在前端的应用（九）（TBD）


开源项目整理：      
* 使用 lerna 整理归类一些 repo   
* 为所有已发布的项目准备好规范文档     
* 添加 UT 测试     
* 集成 travis cli      
* changelog        
* 清理无用的 repo      
* 整理 tfjs model 项目   
* ui-market 项目
* standard library 项目    



chromium 源码学习：
https://github.com/chromium/chromium


搭建个人网站

