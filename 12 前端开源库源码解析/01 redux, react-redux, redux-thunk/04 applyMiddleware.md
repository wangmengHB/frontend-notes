# applyMiddleware 和 Thunk

applyMiddleware的代码也很简单，其全部的源码如下：
```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
        `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

```
createStore中的使用enhancer构建store的部分：
```js
return enhancer(createStore)(reducer, preloadedState)
```

## 中间件函数
要理解以上函数，首先最重要的一点就是理解什么是中间件函数. 中间件函数作用是用来定制dispatch(action)的过程. 用更通俗的语言描述就是，中间件函数是用来定制store.dispatch函数，但有限制，它只能往dispatch中注入新特性，但是不能修改Redux的主线流程. 也就是说，中间件改变的过程是dispatch触发以后，但是reducer执行之前的过程.

为了达到注入dispatch新特性的目的，中间件函数必需具备以下几个特征（可以理解为Redux中间件的接口要求）：
1. 必需是以({dispatch, getState})作为输入.
2. 函数形式 ({dispatch, getState}) => next => action => {}
3. 最内的一层函数必需要 return next(action), 因为dispatch函数必需返回一个action.

再分析applyMiddleware函数
```js
chain = middlewares.map(middleware => middleware(middlewareAPI))
```
这实际上将三层的中间件函数变成了两层，同时把接口传进去了.
```js
 next => action => next(action)
```

```js
dispatch = compose(...chain)(store.dispatch)
```
组合了所有的中间件，同时将真正的store.dispatch传入执行了一次组合函数, 将两层函数进一步变成了一层函数，同时这个next指代的就是最原始的store.dispatch. 同时这个组合函数执行后返回的结果刚好是这个一层函数：输入是action对象，它就是一个dispatch函数，这也就是定制后的dispatch函数.
```js
action => next(action)
```
在return next(action)之前，加入你的中间件定制代码，即是相当于定制了dispatch(action)的流程.

这里最难理解的地方就是这个组合函数.
先有a, b, c, d 四个二层函数，每个函数的结构是 next => action => {return next(action)}.

组合函数的结果是: (...arg) => a(b(c(d(...arg)))).

组合函数执行的结果是把最原始的store.dispatch作为最后一个d函数的输入next传入.
```
d执行结果: action => {return next(action)}
c执行结果：
            -----------------------------
                                |
            action => {return next(action)}

b执行结果：
            -------------------------------
                                    |
                action => {return next(action)}

a执行结果：
                -------------------------------
                                        |        
                    action => {return next(action)}

```
组合函数返回的结果是最后一个 action => {return next(action)}, 这个函数即是最终定制的dispatch函数，它的next是指b函数执行结果，b执行结果中的next指的是c，... 依次最后一个next才指代最原始的store.dispatch.

所以最终的中间件执行的顺序是 a -> b -> c -> d, 最后才是原始的store.dispatch.

### 小技巧
注意：applyMiddleware函数中运用到了一个函数延迟的小技巧，最初传入的{dispatch, getState}对象中dispatch是无效的函数，最后生成定制的dispatch函数之后再将其替换，意图在这些初始化完成之前是不允许调用调用dispatch的.
```js
let dispatch = () => {
    throw new Error(
    `Dispatching while constructing your middleware is not allowed. ` +
    `Other middleware would not be applied to this dispatch.`
    )
}
const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
}
dispatch = compose(...chain)(store.dispatch)
```
初始化时传入的dispatch函数是一个无效的函数，当完成初始化以后，再将其赋值为正确的函数. 这个延迟赋值的技巧很巧妙, 即使传入包装函数被存起来了，但只有它被调用的时候才会取值，这个时候它已经是正确的函数了.
```js
let xxx = () => {};
let target = {
    xxx: (...args) => xxx(...args)
}
xxx = ...;
```

### 中间件小结
中间件函数的结构形式：三层
```js
({dispatch, getState}) => next => action => {
    ...
    return next(action)
}
```


### 中间件示例
#### Thunk 中间件

以下是redux-thunk的全部源码：
```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
里面的定制部分就是 return next(action)之前的部分。

thunk里面最重要将异步的action函数返回的是函数而非action对象，异步函数的结构形式(接口)：
```js
let asyncActionFun = (param) => (dispatch, getState) => {
    // some aync part
    setTimeout(() => {
        dispatch(action)
    }, 1000)
}

// 调用时
store.dispatch(asyncActionFun(123));
```
thunk中间件在return next(action)之前，提前将其返回了，也就是说后面reducer过程都没有执行.

#### redux-logger 中间件

redux-logger是一个将每一个dispatch过程打一个日志方便调试，以下只是其核心部分代码，详细代码请参照：[redux-logger](https://github.com/theaqua/redux-logger#readme)

```js

function createLogger(options = {}) {

  const logBuffer = [];

  return ({ getState }) => next => (action) => {

    const logEntry = {};

    logBuffer.push(logEntry);

    logEntry.started = timer.now();
    logEntry.startedTime = new Date();
    logEntry.prevState = stateTransformer(getState());
    logEntry.action = action;

    let returnedValue;
    if (logErrors) {
      try {
        returnedValue = next(action);
      } catch (e) {
        logEntry.error = errorTransformer(e);
      }
    } else {
      returnedValue = next(action);
    }

    logEntry.took = timer.now() - logEntry.started;
    logEntry.nextState = stateTransformer(getState());

    const diff = loggerOptions.diff && typeof diffPredicate === 'function'
      ? diffPredicate(getState, action)
      : loggerOptions.diff;

    printBuffer(logBuffer, Object.assign({}, loggerOptions, { diff }));
    logBuffer.length = 0;

    if (logEntry.error) throw logEntry.error;
    return returnedValue;
  };
}

```



