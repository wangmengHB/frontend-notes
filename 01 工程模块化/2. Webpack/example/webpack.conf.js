const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


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
    optimization: {
        minimize: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack lazy load sample'
        })
    ]
}
