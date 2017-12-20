const fs = require("fs");
const path = require("path");

const baseConfig = require("./webpack.config");

// Taken respectively from http://blog.scottlogic.com/2017/06/06/typescript-electron-webpack.html
const readDirRecursiveSync = (folder, filter) => {
    const currentPath = fs.readdirSync(folder).map(f => path.join(folder, f))
    const files = currentPath.filter(filter);

    const directories = currentPath
        .filter(f => fs.statSync(f).isDirectory())
        .map(f => readDirRecursiveSync(f, filter))
        .reduce((cur, next) => [...cur, ...next], []);

    return [...files, ...directories];
}

const getEntries = (folder) =>
    readDirRecursiveSync(folder, f => f.match(/.*test\.tsx?$/))
        .map((file) => {
            return {
                name: path.basename(file, path.extname(file)),
                path: path.resolve(file)
            };
        })
        .reduce((memo, file) => {
            memo[file.name] = file.path;
            return memo;
        }, {});

module.exports = [
    Object.assign(baseConfig[1], { entry: getEntries('./test/renderer/') })
].map(s => {
    s.output.path = path.resolve(__dirname, '__tests__');
    return s;
});
