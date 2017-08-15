var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var publicPath = path.resolve(__dirname, "../public");

module.exports = {
    context: './src',
    entry: {
        CrossDomainProxy: ["./cross-domain-proxy"],
        CrossDomainAjax: ["./cross-domain-ajax"],
        demo: "./demo"
    },
    output: {
        path: publicPath,
        filename: "[name].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: ['demo']
        }),
        new HtmlWebpackPlugin({
            title: 'Cross proxy',
            filename: 'cross-proxy.html',
            template: 'cross-proxy.html',
            minify: {
            },
            inlineSource: '.(js|css)$',
            chunks: ['CrossDomainProxy']
        }),
        // new HtmlWebpackInlineSourcePlugin()
    ],
    devtool: 'cheap-module-source-map',
    "devServer": {
        hot: true,
        "contentBase": publicPath,
        "publicPath": "",
        "disableHostCheck": true
    },
};