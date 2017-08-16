var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var publicPath = path.resolve(__dirname, "./dist");

module.exports = {
    context: './src',
    entry: {
        CrossDomainProxy: ["./cross-domain-proxy"],
        CrossDomainAjax: ["./cross-domain-ajax"],
        demo: "./demo",
        "demo-proxy": "./index"
    },
    output: {
        path: publicPath,
        filename: "[name].js",
        libraryTarget: "umd"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['demo']
        }),
        new HtmlWebpackPlugin({
            title: 'Cross proxy',
            filename: 'cross-proxy.html',
            minify: {
                minifyJS: { ie8:true, parse: { bare_returns: undefined } }
            },
            inlineSource: '.(js|css)$',
            chunks: ["demo-proxy"]
        }),
        new HtmlWebpackInlineSourcePlugin()
    ],
    devtool: 'cheap-module-source-map',
    "devServer": {
        hot: false,
        "contentBase": publicPath,
        "publicPath": "",
        "disableHostCheck": true
    },
};