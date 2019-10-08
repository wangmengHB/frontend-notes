# devtool: [string | false] 此选项控制是否生成，以及如何生成 source map.
可以使用 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin进行更细粒度的配置，来代替devtool配置，但是不要同时使用.
使用 source-map-loader 来处理已有的source map.
选择一种 source map 格式来增强调试过程. 不同的值会明显影响到build和rebuild的速度.

它的可选值：(基本是按照构建速度排序)
* (none): (可用于生产环境)
* eval
* cheap-eval-source-map
* cheap-module-eval-source-map
* eval-source-map
* cheap-source-map
* cheap-module-source-map
* inline-cheap-source-map
* inline-cheap-module-source-map
* source-map：(可用于生产环境)
* inline-source-map
* hidden-source-map: (可用于生产环境)
* nosources-source-map: (可用于生产环境)
具体的含义，请参照：
https://github.com/webpack/webpack/tree/master/examples/source-map

## 对于生产环境
* (none)（省略 devtool 选项） - 不生成 source map
source-map - 整个 source map 作为一个单独的文件生成。它为 bundle 添加了一个引用注释，以便开发工具知道在哪里可以找到它。
注意：你应该将你的服务器配置为，不允许普通用户访问 source map 文件！ 

* hidden-source-map - 与 source-map 相同，但不会为 bundle 添加引用注释。
如果你只想 source map 映射那些源自错误报告的错误堆栈跟踪信息，但不想为浏览器开发工具暴露你的 source map，这个选项会很有用。
注意：你不应将 source map 文件部署到 web 服务器。而是只将其用于错误报告工具。 

* nosources-source-map - 创建的 source map 不包含 sourcesContent(源代码内容)。它可以用来映射客户端上的堆栈跟踪，而无须暴露所有的源代码。你可以将 source map 文件部署到 web 服务器。
注意：这仍然会暴露反编译后的文件名和结构，但它不会暴露原始代码。 