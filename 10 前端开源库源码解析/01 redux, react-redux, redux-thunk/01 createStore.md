关于Redux的详细源码，请参看 (https://github.com/reactjs/redux.git)

本文只是对源代码的一个讲解.

# createStore

为了方便理解，我们把代码中防御性部分给去掉，突出主线流程.


## 接口部分代码：
```js
function createStore(reducer, preloadedState, enhancer) {
  ...
  dispatch({ type: ActionTypes.INIT })
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```
输入：
1. reducer函数(总体的reducer函数)
2. 初始化的state，这里的state是指整体的初始化state，实际上在我们定义每个reducer的时候，已经定义过各个子命名空间下的初始state，所以这个preloadedState是不需要传入的.
3. enhancer 在后续讨论到thunk中间件的时候再详细说明，用于使用中间件的方式定制dispatch(action函数(参数))的行为.
如果preloadedState缺省，则可以把enhancer作为第二个参数.

输出一个Store, 这个store有以下方法：
1. dispatch
2. getState
3. subscribe
4. replaceReducer
5. [Symbol.observable] 实际上是Symbol('observable')
说明：subscribe实际上在react-redux中已经封装好了，将react的component的 this.setState给注册到了store上了, 当store.dispatch发生，UI就会出发更新，关于这一点暂时是不需要过多关注的.
replaceReducer是几乎不会被用到.
[Symbol.observable]用到的概率就更低了.

### 处理输入参数(很常见的javascript手法)
```js
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

```
preloadedState是几乎不需要的, 理由是reducer肯定不止一个.
以上这句话的意思就是，如果preloadedState缺省，enhancer可以作为第二参数.
至于 enhancer(createStore)(reducer, preloadedState), 在讲到中间件的时候再解释.


### 接口 getState

```js
let currentReducer = reducer
let currentState = preloadedState
let currentListeners = []
let nextListeners = currentListeners
let isDispatching = false
  function getState() {
    if (isDispatching) {
      throw new Error()
    }

    return currentState
  }

```
代码很简单，这里有一个细节需要注意：
1. 内部设置了互斥量 isDispatching, 如果是dispatch, subscribe或unsubscribe没有完成，是不能够getState，后果是直接抛异常了. 
2. currentState 初始化时是undefined (preloadedState不传入)

nextListeners和currentListener实际上是一回事，作者之所以这样写，只是为了区分subscribe前后, 在实际应用没有涉及到，所以可以认为它们就是一个东西，它是一个数组存放回调函数，标准的观察者模式，当store里的currentState更新以后，触发这些回调函数依次执行.

### subscribe 接口
```js
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    if (isDispatching) {
      throw new Error()
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error()
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }
```
可以忽略里面的currentListeners和nextListeners来回倒腾，它唯一的作用区分subscribe前后listen的不同.

subscribe接口返回一个unsubscribe函数，执行以后，将该次注册的回调函数从监听列表中去掉.

### dispatch接口 （最重要的接口)
```js
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error()
    }

    if (typeof action.type === 'undefined') {
      throw new Error()
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

```
这里实际上就解释了：为什么action对象必需是plain object.
过程很简单，执行reducer，算出一个新的state，然后执行监听函数.
容易漏掉的内容是，dispatch函数返回当前的action对象.
这在有些中间件中用到这个特性.
函数式编程，返回值类型也是接口的一部分.

看到这里实际上，通常会产生一个困惑，如果一个state并没有发生变化，监听函数也会被执行，这样会导致UI不必要render过程发生，造成性能问题.

关于这部分的问题，在react-redux做了一些优化，监听函数继续会被执行，但是UI的重复render是可以控制的，可以采用immutableJs以及React中PureComponent来进一步优化.

最后一个步骤：
在store创建之前，执行了一次 dispatch({ type: ActionTypes.INIT }), 这个过程的意思是创建初始化的 state, 因为各个子reducer都被执行了一遍，所以各个子reducer的初始化state都会被汇总到总的state上. 这也就是没有必要设置总的preloadedState的原因.


##### 其他两个不重要的接口

```js

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }


  function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

}

```
1. observable接口是挂在Symbol.observable属性下，意图就是不希望用户使用.
2. observable函数返回的对象，是一个对象具有subscribe方法，而该subscribe方法的输入对象必需具有next方法，符合这个条件，也就是生成器函数返回的迭代器.

以下是代码是Symbol-observable的源码，解释$$observable到底是什么.
```js
export default function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

```
