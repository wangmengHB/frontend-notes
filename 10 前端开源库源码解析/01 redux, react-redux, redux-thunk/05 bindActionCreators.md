# bindActionCreators

bindActionCreators接口不是Redux中的核心接口，它只是一辅助代码简化的工具.
在Redux结构总，发起一个动作的写法是，store.dispatch(actionCreator(参数)). bindActionCreators的作用，就是期望把这个写法简化成 actionCreator(参数). 它的作用就是这个，仅此而已.

actionCreator实际上就是我们之间说的action函数，actionCreators就是一堆定义在同一个文件ES6 module)里的总对象.

bindActionCreator(actionCreators, dispatch)

输入就是action函数，或者action函数的集合对象， 它返回的是一个新函数或对象，对象的函数名字还和action函数一样，只是把dispatch给封装进去了.

store.dispatch(actionCreator(param))  ==>  newActionCreator(param)

以下是bindActionCreators函数的源码：

```js
function bindActionCreator(actionCreator, dispatch) {
  return function() { return dispatch(actionCreator.apply(this, arguments)) }
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` +
      `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

```


## 小结
关于Redux的核心代码，到此已经完全解析完了，它的核心代码只说明了数据流的问题，规范了action函数，action对象，dispatch，getState等等行为. 但是，如何将Store和一个React组件之间产生联系，它并没有做任何工作.

后面继续解析的是react-redux，它实现了将store传入和绑定到组件的功能. 它的最主要的接口是Provider，connect.