

2. webgl入门
3. 绘制和变换三角形
4. 高级变换和动画基础
5. 颜色和纹理



着色器语言.


# webgl 坐标系
webgl中，当你面向屏幕时，x轴正方向向右，y轴正方向向下，z轴正方向面向屏幕外。
事实上，webgl既不是右手坐标系，也不是左手坐标系。？？？
webgl的坐标系和 `<canvas>` 绘图区的坐标系不同，（0.0，0.0，0.0）对应canvas的中心点。
其他方向需要动手需实验验证。

# js 和 着色器的交互
对于顶点着色器，通过 attribute 类型变量传入顶点坐标，通过 uniform 类型变量传入变换矩阵.
在js中：
```js
// 'a_Position' 是在着色器中定义的 Attribute 类型的变量名
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');    
gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);   // 给顶点坐标赋值
```
对于片元着色器，通过 uniform (或varing) 类型变量传入颜色值。
```js
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 0.1, 0.2, 0.3, 1.0);
```
webgl 提供了一种缓冲区机制，缓冲区对象 buffer object, 可以一次性向着色器传入多个坐标。
缓冲区对象是webgl中的一块内存区域。
使用缓冲区对象向着色器中传入数据的步骤：
1. 创建缓冲区对象，gl.createBuffer()
2. 绑定缓冲区对象，gl.bindBuffer()
3. 将数据写入缓冲区对象，gl.bindData()
4. 将缓冲区对象分配给一个 attribute 类型的变量，gl.vertexAttribPointer()
5. 开启 attribute 变量，gl.enableVertexAttribArray()



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
1. gl.POINTS: 只有在这种模式下，gl_PointSize 才会生效。
2. gl.LINES: (v0, v1), (v2, v3), (v3, v4)... 一系列单独的线段, 如果点为奇数，最后一个点将忽略
3. gl.LINE_STRIP: (v0, v1), (v1, v2), ..., 一系列连接的线段。
4. gl.LINE_LOOP: (v0, v1), (v1, v2), ..., (vn, v0), 一个闭环的连续线段
5. gl.TRIANGLES: (v0, v1, v2), (v3, v4, v5), ..., 一系列单独的三角形，如果个数不是3的倍数，多余的点会被忽略。
6. gl.TRIANGLE_STRIP: 一系列连着的三角形，每连着的3个点绘制一个三角形.
下一个三角形，第一个边的顺序和上一个三角形的最后一条边顺序相反。
(v0, v1, v2), (v2, v1, v3), (v2, v3, v4), (v4, v3, v5), (v4, v5, v6), ....
7. gl.TRIANGLE_FAN: 三角扇，(v0, v1, v2), (v0, v2, v3), (v0, v3, v4), ...
* first: 指定从哪个顶点开始绘制
* count: 指定需要绘制的顶点个数
实际上，顶点着色器执行了 count 次，存储在缓冲区中的顶点坐标数据被依次传给 attribute 变量。
## gl.getAttribLocation(program, name)
获取由 name 参数指定的 attribute 变量的存储地址，如果返回值为 -1， 表示不存在。
* program: gl.program, 它包含了两个着色器的程序对象
* name: 指定想要获取其存储地址的 attribute 变量的名称。
## gl.vertexAttrib(1-4)f(a_Position, v0, v1, ...)
## gl.vertexAttrib(1-4)fv(a_Position, [v0, v1, ...])
从js中向着色器中的 attribute 变量，传入维度为 1 - 4的 float值数组。
## gl.getUniformLocation(program, name)
## gl.uniform(1-4)f
## gl.uniform(1-4)fv
## gl.uniformMatrix(1-4)fv(location, transpose, matrix)

## gl.createBuffer() | gl.deleteBuffer(buffer)
## gl.bindBuffer(target, buffer)
将缓冲区对象绑定到 webgl 系统中已经存在的 target 上。 target 表示缓冲区对象的用途。
target参数:
1. gl.ARRAY_BUFFER: 表示缓冲区对象中包含了顶点的数据。
2. gl.ELEMENT_ARRAY_BUFFER: 表示缓冲区对象中包含了顶点的索引值。
## gl.bufferData(target, data, usage)
将data中的数据写入到绑定了target的缓冲区对象，不能直接向buffer写入数据，只能向target写入数据。
usage: 表示程序将如何使用存储在缓冲区对象中的数据。
1. gl.STATIC_DRAW: 只会向缓冲区对象中写入一次数据，但需要绘制很多次。
2. gl.STREAM_DRAW: 只会向缓冲区对象中写入一次数据，然后绘制若干次。 ？？
3. gl.DYNAMIC_DRAW: 会向缓冲区对象中多次写入数据，并绘制很多次。
## gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
将绑定到 gl.ARRAY_BUFFER 的缓冲区对象分配给由 location 制定的 attribute 变量。
size：指定缓冲区中每个顶点的分量个数（1 - 4）。如果 size 比 attribute 变量需要的分量数小，缺失分量将按默认不全，第4位为1，其他为0.
type: 
1. gl.UNSIGNED_BYTE
2. gl.SHORT
3. gl.UNSIGNED_SHORT
4. gl.INT
5. gl.UNSIGNED_INT
6. gl.FLOAT
normalized: true 或 false，表明是否非浮点类型的数据归一化到 [0, 1], 或 [-1, 1] 区间。
stride: 指定相邻两个顶点间的字节数，默认为0.
offset: 指定缓冲区对象中的偏移量，以字节为单位，即 attribute 变量从缓冲区中的何处开始存储。
## gl.enableVertexAttribArray(location) | gl.disableVertexAttribArray(location)
开启 attribute 变量。






161 -213 颜色和纹理
247 - 501 
7. 进入三维世界
8. 光照
9. 层次模型
10. 高级技术


135 - 138 139 - 160 矩阵

