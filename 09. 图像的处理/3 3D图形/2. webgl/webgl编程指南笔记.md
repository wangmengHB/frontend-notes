136 -183 颜色和纹理
184 - 215 OpenGL ES



2. webgl入门
3. 绘制和变换三角形
4. 高级变换和动画基础
5. 颜色和纹理

7. 进入三维世界
8. 光照
9. 层次模型
10. 高级技术

着色器语言.

51 - 501
gl.clearColor(r, g, b, a)：设置gl全局的 clearColor.
取值范围从 0.0 - 1.0 的浮点数。
gl.clear(buffer):
将指定缓冲区设定为预定的值。
如果清空的是颜色缓冲区，那么将使用 gl.clearColor() 指定的值（作为预定值）。
buffer:
1. gl.COLOR_BUFFER_BIT, 颜色缓冲区，默认值（0.0， 0.0， 0.0， 0.0）, gl.clearColor(r,g,b,a)
2. gl.DEPTH_BUFFER_BIT, 深度缓冲区, 默认值 1.0， gl.clearDepth(depth)
3. gl.STANCIL_BUFFER_BIT, 模板缓冲区, 默认值 0， gl.clearStencil(s) 

gl.clear(gl.COLOR_BUFFER_BIT) 使用 clear color 清空画布。


