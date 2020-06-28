# mapState的使用方法
通过在computed中通过mapState将store中的数据取出来，传递到UI上.
```js
computed:{
    ...mapState({
        propOnUI: state => state.moduleName.propA
    }),
},
```
为什么前面要使用...? 因为mapState函数返回的是一个对象，但是computed要求是一个对象，所以需要将mapState中返回的对象按照属性展开.

# mapState的使用方法
```js
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
  }
  return module
}

```

mapState实现方式采用了函数式编程, mapState的接口实际上是(namespace, map), 但最常用的使用方法是只传入一个参数{propOnUI: state => state.moduleName.propA}. 也就是说还使用到它的namespace功能.

