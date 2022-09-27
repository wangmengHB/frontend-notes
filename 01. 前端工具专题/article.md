
# npm 模块
模块化是软件开发的基石，可以毫不夸张地说，任何一个成熟的复杂应用程序系统都是由很多个模块聚合编排在一起的结果。按照惯例，一个功能独立的软件模块或单元，通常会被称为一个 package。在 js 开发领域，一个标准的 package 是以 node.js 的 npm package 的形式组织起来的。

关于什么是 npm， 请参看：https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/
简而言之，npm 指的是两个东西：
* [node.js](https://nodejs.org/en/) 中自带的一个命令行工具，主要用于帮助安装、版本管理和依赖管理。
* npm 仓库（https://www.npmjs.com）, 以 node.js 开发的 package 可以发布到这个公共仓库中， 并且在项目中通过运行 npm install （或 yarn install） 命令可以下载依赖。在实践中，也可以搭建组织内私有的 npm 仓库，比如 jfrog, verdaccio 等等。

## package 的描述： package.json
package.json 是对一个 node.js 包的定义描述，关于具体的内容可以参考以下文章:
* 标准文档：https://docs.npmjs.com/files/package.json
* 中文文章：https://github.com/jaywcjlove/package.json
* 参考资源：
    * https://github.com/jamiebuilds/std-pkg
    * https://github.com/shashkovdanil/clean-publish
    * http://package-json-validator.com/
    * https://github.com/davidtheclark/cosmiconfig

和其他渐进性标准一样，package.json 的定义会随着时间推移有一些字段扩展：其中有些字段是由 node.js 官方提供的，还有一些字段是由其他很有影响力的工具提供的，比如：yarn，typescript，unpkg, webpack, jest 等等。对于那些非官方提供的字段，随着普及使用程度地提高，也同样具备准标准的效力。

### 1. 重要的第三方扩展的字段
#### 1.1. typescript 扩展
* types 和 typings, 可以认为 typings 是 types 的别名，它是用于指定该 package 的 typescript 类型声明文件, 比如 index.d.ts。对于 typescript 解释器来说，index.js 和 index.d.ts 一起可以组合还原出原始的 index.ts 文件内容。
* typesVersion: 指定 ts 的版本，这个字段在实际项目中几乎用不到。

参考文档：https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html

问题：是否可以在 main 字段直接指定 index.ts 文件？
不能。原因如下：
1. 尽管 typescript 在项目开发中已经越来越普及，但真正运行时的代码仍然是转译后的 js。
2. ts/js 只是 web 应用的一部分，css / svg / font 等等都是 web 应用上需要用到的资源，对于这部分的资源的处理，不在 typescript 的设计范围内。
3. tsc 的功能是有限的，仅仅只进行转译，不会处理别名。

#### 1.2. rollup 和 webpack 的扩展
* module：https://github.com/rollup/rollup/wiki/pkg.module

module 字段指定 ESModule 格式的入口文件，它只对打包工具 webpack 和 rollup 等打包工具有用。可以参看 webpack 中的 resolve.mainFields 属性的说明：https://webpack.js.org/configuration/resolve/#resolvemainfields。从文档中可以看出，webpack 的默认配置，从以 browser/module/main 的优先次序去读取 package。

* sideEffects

#### 1.3. yarn 的扩展
* flat 
* resolutions


#### 1.4 多 package 的支持
https://docs.npmjs.com/cli/v8/using-npm/workspaces



#### 1.5 其他
* unpkg：https://unpkg.com/

对于所有发布到公共 npm 上的 package， 实际上它们同时也部署到了 unpkg.com 的 cdn 上，可以通过设置 unpkg 字段来指定 cdn 的主 js 文件。这个功能对于大公司来说没什么用，他们通常会把资源发布到自己的 cdn 上。但是，对于个体独立开发者来说，可以免费地发布 cdn 还是一件很好的事情。为了利用 unpkg cdn 的功能，你需要给自己的 npm package 输出一份便于 web 上使用的打包后的 js 文件。



实际上，还有很多其他工具也提供了一些扩展，比如 jest， babel 等等。

### 2. node.js v12 中扩展的重要可选字段
* type
* exports 
* imports

文档：https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_node_js_package_json_field_definitions

#### 2.1. type 
可选值："commonjs" 或 "module", 缺省默认值是 "commonjs"。
它的作用是告诉 node.js 应该是以 commonjs 或者 ESModule 的方式去 load 当前 package 的所有 js 文件。

区别于上面提到的 “module” 字段（只针对打包工具），这个 “type” 字段的影响范围更大，它是针对整个 package 的所有 js 文件（由 main 字段指定的入口开始）。

如果在 package.json 中使用了 type 属性，则必需要在 package.json 指定 nodejs 的版本。
```json
{
    "engines": {
        "node": ">=12.0.0"
    }
}
```

#### 2.2. exports 和 imports
* "exports" - Package exports and conditional exports. When present, limits which submodules can be loaded from within the package.
* "imports" - Package imports, for use by modules within the package itself.

这两个字段主要用于对 package 的更消息的描述, 如果不是开发纯 node.js package，这两个字段可以忽略。




## 如何生产一个标准的 npm package
* package 类型分类？
* npm package 是否需要打包 ？webpack, rollup or tsc ？



### 例子

#### 1. UI 组件的 package

#### 2. nodejs util 的 package

#### 3. cli 的 package


