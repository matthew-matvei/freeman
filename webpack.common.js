const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const GoogleFontsPlugin = require("google-fonts-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPackPlugin = require('happypack');

const extractSass = new ExtractTextPlugin({ filename: "[name].css" });
const googleFonts = new GoogleFontsPlugin({
    fonts: [
        { family: "Ubuntu" },
        { family: "Ubuntu Mono" }
    ],
    formats: ["woff2"]
});
const happyPack = new HappyPackPlugin({
    id: "ts",
    threads: 2,
    loaders: [{
        path: "ts-loader",
        query: { happyPackMode: true },
        options: {
            onlyCompileBundledFiles: true
        }
    }]
});
const forkTsChecker = new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true });

const commonConfig = {
    output: { path: path.resolve(__dirname, "app"), filename: "[name].js" },
    devtool: "cheap-module-eval-source-map",
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
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "happypack/loader?id=ts"
            },
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
        (ctx, req, done) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done())
    ]
};

module.exports = [
    Object.assign(
        {
            target: "electron-main",
            entry: { main: "./src/main/index.ts" },
            plugins: [happyPack, forkTsChecker]
        }, commonConfig),
    Object.assign(
        {
            target: "electron-renderer",
            entry: { renderer: "./src/renderer/index.tsx" },
            plugins: [happyPack, forkTsChecker, extractSass, googleFonts]
        }, commonConfig)
];
