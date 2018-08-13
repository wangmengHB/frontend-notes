# 1. Object.create(proto, [propertiesObject])
方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__


# 2. Object.freeze(obj) | Object.isFrozen(obj)
冻结一个对象, 并且返回该对象，冻结意思指的是:
1. 不能向这个对象添加新的属性，
2. 不能修改其已有属性的值，
3. 不能删除已有属性，
4. 不能修改该对象已有属性的可枚举性、可配置性、可写性
说明：这里冻结一个对象的属性，仅仅只是对象自身的属性，对于嵌套对象的属性无影响.

```js
let origin = {...}
let dest = Object.freeze(origin)

dest === origin   // true

```