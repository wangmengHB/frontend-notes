# combineReducers
combineReducers是redux提供的第二重要的方法，对于那些mini的小程序来说，combineReducers不是必需的.

对于稍微具备一些规模的应用来说，一个reducer函数是不够的，必需按照业务划分出来多个reducer函数，最后合并成一个总的reducer用于构造store，这种情况下， combineReducers则是必需的.


## 源码分析（去掉了防御代码, 突出核心流程）

```js
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  return function combination(state = {}, action) {

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}

```

## combineReducers 的输入
它的输入是一个key-value对的对象，对象的key是reducer的名字，value是reducer函数. 这是它接口要求(否则作者也不会写那么多防御代码).
鉴于ES6里面对于代码简写的改进，通常我们看到的例子如下:
```js
import reducer1 from './reducer1'
import reducer2 from './reducer2'
let final = combineReducers({
    reducer1,
    reducer2,
})
```
在这里传入对象的key的名字就是reducer1, reducer2, 建议大家应该根据业务需要来给reducer函数取一个能够反映业务分类的名字.
这个名字在你后续将store绑定到react组件的时候是需要知道的.

## combineReducers 的输出
它的是输出是一个总的reducer函数，该函数的输入要符合标准reducer的要求, 即 (state = initial, action) => nextState.

### 代码过程分析
```js
const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)
```
这部分代码很简单，就是把输入的对象(key-value对)整理下存起来.

返回的总的reducer函数：
```js
function combination(state = {}, action) {
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
```
分析这代代码之前，需要先回顾一下，store是如何调用reducer的: dispatch一个action时，currentState = reducer(currentState, action).
当一次调用的时候，如果没有设置preloadedState, 则currentState为undefined.
可以看到以上函数的初始state为一个空对象，刚好对应这种场景.
如果设置了preloadedState, 则上述函数的初始state为preloadedState.

第一眼看上述代码，很容易得出结论：它就是把所有的子reducer函数依次执行了.

这里的关键问题是要弄清楚，它是如何处理整个state的结构, 以及当前的state和nextState.

它把整体的state按照reducer的名字也拆分成各个子空间里. 各个子reducer函数生成的新state，就对应地放置在该子空间里，不同的reducer之间不会互相干扰.

最核心也就是循环体中的这一部分代码：

```js
const previousStateForKey = state[key]
const nextStateForKey = reducer(previousStateForKey, action)
if (typeof nextStateForKey === 'undefined') {
const errorMessage = getUndefinedStateErrorMessage(key, action)
throw new Error(errorMessage)
}
nextState[key] = nextStateForKey
hasChanged = hasChanged || nextStateForKey !== previousStateForKey

```












