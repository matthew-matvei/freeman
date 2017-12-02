const path = require("path");

const baseConfig = require("./webpack.config");

module.exports = [
    Object.assign(baseConfig[0], { entry: "./all-tests.js" })
].map(s => {
    s.output.path = path.resolve(__dirname, "__tests__");
    return s;
});
