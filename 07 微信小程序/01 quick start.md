# 开发微信小程序

开发微信小程序的准备工作：
1. 准备三个与微信没有绑定关系的email账号，微信公众平台支持三种类型的应用开发：公众号，订阅号和小程序. 一个email只能注册一种类型.如果只开发微信小程序，注册一种就行了.
2. 登录微信公众平台完成注册工作：https://mp.weixin.qq.com/
3. 下载微信开发者工具：https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html

推荐使用wepy框架来进行小程序的开发(https://github.com/Tencent/wepy)
1. 全局安装wepy
```cmd
npm install -g wepy-cli
```
2. 创建一个微信小程序工程
```cmd
wepy init standard project-name
cd project-name
npm install
```
说明：wepy的脚手架提供的package.json中的devDependencies不是很全，需要稍微调整补全一下.
3. 打开[微信开发者工具], 创建工程，并且将工程路径指向 project-name/dist
4. 关闭[微信开发者工具]中项目设置中：
    * ES6转ES5
    * 上传代码时样式自动补全
    * 代码上传时自动压缩
整个开发工作基本上不在[微信开发者工具]提供的IDE中进行，[微信开发者工具]的作用就只是用作小程序调试和上传小程序到微信公众平台的作用.


