
// importing to help webpack autoreload on changes
require("html!../rest-api.html");

beforeEach(function() {
  // import our elements
  var elements = ['rest-api', 'rest-config'];
  elements.forEach(function(name) {
    var link = document.createElement("link");
    link.rel = "import";
    link.href = '../bower_components/rest-api/' + name + '.html';
    document.head.appendChild(link);
  });

  this.testPanel = document.createElement("div");
  this.testPanel.id = "test";
  document.body.appendChild(this.testPanel);
});


require("./testRestApi");

// if you forget you have hot loading enabled
// it can cause headaches in the console
console.clear();
