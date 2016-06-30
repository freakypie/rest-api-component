const path = require("path");
const folderName = path.basename(__dirname);

config = {
  entry: "mocha!./test/test.js",
  output: {
    filename: "test.js"
  },
  resolve: {
      modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },
  devServer: {
    proxy: {
    }
  }
};

// adding current folder to bower_components
config.devServer.proxy[`/bower_components/${folderName}/*`] = {
  bypass: function(req) {
    return req.url.replace(`/bower_components/${folderName}/`, "");
  }
};

module.exports = config;
