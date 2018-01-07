const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.common");

const commonProduction = {
    devtool: "source-map",
    plugins: [
        new UglifyJsPlugin({ sourceMap: true }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
};

const main = merge(common[0], commonProduction);
const renderer = merge(common[1], commonProduction);

module.exports = [main, renderer]
