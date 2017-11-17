const path = require("path");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const baseConfig = require("./webpack-base.config");
const extractSass = new ExtractTextPlugin("out.css");

module.exports = merge(baseConfig, {
    output: {
        path: __dirname + "/app",
        filename: "out.js"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: ["node_modules/normalize-scss/sass"]
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        extractSass
    ]
});
