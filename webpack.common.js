const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({ filename: "[name].css" });

const commonConfig = {
    output: { path: path.resolve(__dirname, "app"), filename: "[name].js" },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: [
            path.resolve(__dirname, "src", "renderer"),
            path.resolve(__dirname, "src", "main"),
            path.resolve(__dirname, "src", "common"),
            path.resolve(__dirname, "src", "interfaces"),
            path.resolve(__dirname, "test"),
            "node_modules"
        ]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, exclude: /node_modules/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: { minimize: true }
                        },
                        {
                            loader: "sass-loader",
                            options: { includePaths: ["node_modules"] }
                        }
                    ]
                })
            },
            {
                test: /\.css$/,
                use: extractSass.extract({ use: [{ loader: "css-loader" }] })
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }
        ]
    },
    node: { fs: "empty", __dirname: false },
    externals: [
        nodeExternals(),
        {
            "react": "React",
            "react-dom": "ReactDOM",
            "xterm": "Terminal"
        },
        (ctx, req, done) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done())
    ]
};

module.exports = [
    Object.assign(
        {
            target: "electron-main",
            entry: { main: "./src/main/index.ts" }
        }, commonConfig),
    Object.assign(
        {
            target: "electron-renderer",
            entry: { renderer: "./src/renderer/index.tsx" },
            plugins: [extractSass]
        }, commonConfig)
];
