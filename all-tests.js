const context = require.context("./test", true);
context.keys().forEach(context);
module.exports = context;
