# Vue和插件之间的对接方式
所有的Vue插件都需要按照如下的方式和Vue实现对接，包括Vuex，vue-router, vue-i18n等等. 在创建插件实例之前，必须先引入Vue，并且执行一次，Vue.use(<插件名>).
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
...
```
## Vue.use
```js
Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
}

export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```
1. Vue.use提供了Vue和插件之间的接入方式，args.unshift(this), 实际上就是把Vue传入给了插件.
2. 插件应该是一个有install方法的对象，或者一个函数，直接install.
3. install函数的第一个参数就是Vue，参数可以扩展，为Vue.use(Vuex, ...)

## Vuex.install
```js
let Vue // bind on install
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

export default function applyMixin (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

Vuex.install的作用：就是在每一个Vue实例化的时候，将store给传进去给vm.
