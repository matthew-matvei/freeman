const path = require("path");

module.exports = {
    entry: "./src/main",
    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js"
        ],
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    target: "electron",
    node: {
        fs: "empty"
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
