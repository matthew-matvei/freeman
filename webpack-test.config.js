const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack-base.config");

module.exports = merge(baseConfig, {
    entry: "./all-tests.js",
    output: {
        path: __dirname + "/app",
        filename: "outTest.js"
    },
    devtool: "source-map",
});
