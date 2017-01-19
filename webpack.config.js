let HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let path = require('path');
let fs = require('fs');

let srcpath = path.resolve('./src');
let srcDirectories = fs.readdirSync(srcpath);
let config = srcDirectories.filter(dirname => {
    if (dirname === '.DS_Store') {
        return false;
    }
    return true;
}).map(dirname => {
    return {
        devtool: 'cheap-eval-source-map',
        entry: path.resolve(`./src/${dirname}/script.js`),
        output: {
            path: path.resolve(`./build/${dirname}`),
            filename: `${dirname}.bundle.js`
        },
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
                { test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader' },
                { test: /\.scss$/, exclude: /node_modules/, loader: 'style-loader!css-loader!sass-loader' }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({filename: 'index.html', template: path.resolve(`./src/${dirname}/index.html`)}),
        ]
    }
});

module.exports = config;
