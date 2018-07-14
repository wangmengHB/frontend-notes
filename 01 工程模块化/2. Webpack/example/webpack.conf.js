const path = require('path')


module.exports = {
    context: path.resolve(__dirname),
    mode: "production",
    entry: {
        app: path.join(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
        ]
    },
    optimiaztion: {
        minimize: false,
    }
}
