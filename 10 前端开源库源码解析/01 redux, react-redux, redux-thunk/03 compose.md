# compose

compose的源码最简单，但是它的代码最难理解，它的全部源码如下：
```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
先理解一下它的设计意图，然后再详细分析其源码. compose函数的主要作用就是，组合中间件函数，生成最终的enhancer，来创建store. 中间件函数的主要作用是可以定制dispatch(action)的过程, 比如中间件redux-logger，每一次dispatch都打一次日志，在比如中间件thunk，延迟dispatch(action)以实现异步的过程. compose是一个工具函数，将这些中间件函数，转换为一个函数.

## compose的用法
有五个函数，分别是a, b, c, d, e, f. 调用compose(a, b, c, d, e, f)后，会得到一个新的函数(返回的是一个函数，而非函数执行结果):
```js
 (...arg) => a(b(c(d(e(f(...arg)))))) 
```
虽然按照Array.prototype.reduce执行后的内存结构并不是如上面说见的扁平结构，但是其实际效果是和上面的表达式是等价的.

```
() => a(b())
-------------
           |
    () => x1(c())
    ------------
               |
        () => x2(d())
        -------------
                   |
            () => x3(e())
            -------------
                       |
                () => x4(f())

                    ...
```
Array.prototype.reduce真实生成函数空间如上，它实际上对应的生成了N个函数，最后一个函数才是真正返回的函数，它最巧妙的设计在于中间过程的函数定义都是被隐藏了，外界完全看不到它的定义. 只有在函数被执行的时候，才会一个一个去找它的定义.

最终的效果完全等价于： () => a(b(c(e(f()))))

理解了compose函数以后，可以开始了解applyMiddleware的内部实现.