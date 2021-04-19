const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const liveReloadOptions = {

}

console.log('Directory for compiling:');
console.log(path.join(__dirname, "/view/frontend/web/js/"));

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "view/frontend/web/js/"),
        filename: "index_bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    plugins: [
        new LiveReloadPlugin(),
        new CopyWebpackPlugin([
            {
                from:path.join(__dirname, "/view/frontend/web/js/"),
                to:'../../../../../../../../pub/static/frontend/Sm/Shopping/fr_FR/Freento_OrderForm/js/',
                force: true
            },
            {
                from:path.join(__dirname, "/view/frontend/web/js/"),
                to:'../../../../../../../../magento/pub/static/frontend/Sm/Shopping/fr_FR/Freento_OrderForm/js/',
                force: true
            }
        ]),
    ],
    devtool: "source-map"
};
