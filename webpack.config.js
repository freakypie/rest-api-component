config = {
  entry: "mocha!./test/test.js",
  output: {
    filename: "test.js"
  },
  resolve: {
      modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },
};

module.exports = config;
