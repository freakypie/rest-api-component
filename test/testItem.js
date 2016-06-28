require("webcomponentsjs/webcomponents.min.js")

const timer = require("timer-promise");
const assert = require("chai").assert;
const FakeRequest = require("./fakeRequest");

window.XMLHttpRequest = FakeRequest;


describe("item-add", function() {

  beforeEach(function(done) {
    this.config = document.createElement("rest-config");
    this.api = document.createElement("rest-api");
    this.el = document.createElement("item-add");
    this.el.collectionParsePath = "results";
    this.testPanel.appendChild(this.config);
    this.testPanel.appendChild(this.api);
    this.testPanel.appendChild(this.el);
    FakeRequest.reset();

    HTMLImports.whenReady(function() {
      done();
    });
  });

  it("will add it's item when clicked", function() {
    this.api.data = [];
    this.el.dispatchEvent(new CustomEvent("click"));
    return timer.start("timer", 10).then(function() {
      assert.equal(this.api.data.length, 1);
    }.bind(this));
  });
});
