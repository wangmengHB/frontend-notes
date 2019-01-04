https://iamturns.com/typescript-babel/


# ts 和 babel 的差异
## 1. ts 只能转码成 ES3/ES5/ES6，而 babel 是根据浏览器版本转码
ts 通过设置 target 属性来指定转码后的JS.
```json
{
  "compilerOptions": {
    "target": "ES5", // ES3, ES5, ES6
  }
}
```
babel 通过 babel-preset-env 来指定浏览器的版本。
```js
"targets": {
	"browsers": ["last 2 versions", "safari >= 7"],
	"node": "6.10"
}
```
