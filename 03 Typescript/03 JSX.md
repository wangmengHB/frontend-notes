# 启用 jsx
1. 文件扩展名：.tsx
2. tsconfig.json --> compilerOptions --> jsx: "preserve" | "react" | "react-native"
preserve: 输出文件为 jsx， 输出 <div />
react: 输出文件为 js， 输出 React.createElement("div")
react-native: 输出文件为 js， 输出 <div />

因为在tsx中会有大量的html元素写法</>, 类型断言（即强制类型转换）使用 as 符号更方便代码阅读。




