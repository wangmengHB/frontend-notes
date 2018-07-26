


## Store类的接口
```js
let Vue;
class Store {
    constructor(options = {}) {}

    get state() {}
    set state() {}

    commit(_type, _payload, _options) {}

    dispatch(_type, _payload) {}

    subscribe(fn) {}

    subscribeAction(fn) {}

    watch(getter, cb, options) {}

    replaceState(state) {}

    registerModule(path, rawModule, options = {}) {}

    unregisterModule(path) {}

    hotUpdate(newOptions) {}

    _withCommit(fn) {}
}

```

## 构造函数
因为之前已经调用过Vue.use(Vue), 所以Vue已经传入进来了，并且存储在一个单例变量Vue中. 以下是简化版的构造函数.

```js
  constructor (options = {}) {
    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))

    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }


```
