136 -183 颜色和纹理

2. webgl入门
3. 绘制和变换三角形
4. 高级变换和动画基础
5. 颜色和纹理

7. 进入三维世界
8. 光照
9. 层次模型
10. 高级技术

着色器语言.


# webgl 坐标系
webgl中，当你面向屏幕时，x轴正方向向右，y轴正方向向下，z轴正方向面向屏幕外。
事实上，webgl既不是右手坐标系，也不是左手坐标系。？？？
webgl的坐标系和 `<canvas>` 绘图区的坐标系不同，（0.0，0.0，0.0）对应canvas的中心点。
其他方向需要动手需实验验证。

# js 和 着色器的交互
通过 attribute 类型变量传入顶点坐标，
通过 uniform 类型变量传入变换矩阵，
在js中：
```js
// 'a_Position' 是在着色器中定义的 Attribute 类型的变量名
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');    
gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);   // 给顶点坐标赋值
```

# 着色器内置变量
gl_Position:
gl_PointSize:
gl_FragColor:


# webgl 的常用 api：
## gl.clearColor(r, g, b, a)：
设置gl全局的 clearColor. r,g,b,a的取值范围从 0.0 - 1.0 的浮点数。
## gl.clear(buffer):
将指定缓冲区设定为预定的值。
buffer:
1. gl.COLOR_BUFFER_BIT, 颜色缓冲区，默认值（0.0， 0.0， 0.0， 0.0）, gl.clearColor(r,g,b,a)
2. gl.DEPTH_BUFFER_BIT, 深度缓冲区, 默认值 1.0， gl.clearDepth(depth)
3. gl.STANCIL_BUFFER_BIT, 模板缓冲区, 默认值 0， gl.clearStencil(s) 
如果清空的是颜色缓冲区，那么将使用 gl.clearColor() 指定的值（作为预定值）。
gl.clear(gl.COLOR_BUFFER_BIT) 使用 clear color 清空画布。
## gl.drawArrays(mode, first, count):
* mode: 指定绘制的方式，可接受以下常量符号：
gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN
* first: 指定从哪个顶点开始绘制
* count: 指定需要绘制的顶点个数
## gl.getAttribLocation(program, name)
获取由 name 参数指定的 attribute 变量的存储地址，如果返回值为 -1， 表示不存在。
* program: gl.program, 它包含了两个着色器的程序对象
* name: 指定想要获取其存储地址的 attribute 变量的名称。
## gl.vertexAttrib(1-4)f(a_Position, v0, v1, ...)

74 - 136 - 501
