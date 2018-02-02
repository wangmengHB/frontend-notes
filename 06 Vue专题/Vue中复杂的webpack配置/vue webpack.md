# vue-loader


# lazy load (component)
vue-cli提供了最亮眼的特色就是支持, 在路由中组件的lazy load. 
lazy load的具体实现是由webpack中配置的.
```js
const ComponentA = () => import('../ComponentA.vue')

const routers = new VueRouter({
    routers: {
        path: 'xxx',
        component: ComponentA
    }
});

```
对应的webpack配置：

## context
```js
context: path.resolve(__dirname, '../'), // 工程根路径
```

## entry
```js
entry: {
    app: './src/main.js'
},
```

## output
```js
output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
},
```


## resolve

```js
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    }
},
```


## module (loaders)
```js
module: {
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                resolve('src'), 
                resolve('test'), 
                resolve('node_modules/webpack-dev-server/client')
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }
    ]
},

```

## node
```js
node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
}

```



