require("webcomponentsjs/webcomponents.min.js")

const assert = require("chai").assert;
const FakeRequest = require("./fakeRequest");

window.XMLHttpRequest = FakeRequest;

describe("rest-listener", function() {

  beforeEach(function() {
    FakeRequest.reset();
    this.target = document.createElement("rest-api");
    this.target.id = "foo";

    this.testPanel.appendChild(this.target);
    this.api = document.createElement("rest-api");
    this.api.collectionParsePath = "results";
    this.el = document.createElement("rest-listener");
    this.el.selector = "#foo";
    this.api.appendChild(this.el);
    this.testPanel.appendChild(this.api);
  });

  afterEach(function() {
    if (this.api) {
      this.testPanel.removeChild(this.api);
      this.testPanel.removeChild(this.target);
      delete this.api;
      delete this.el;
      delete this.target;
    }
    this.testPanel.innerHTML = "";
    localStorage.clear();
  });

  it("listens for data changes, and then updates it's target", function(done) {
    this.api.addEventListener("data-changed", function() {
      assert.equal(this.target.data.length, 8);
      done();
    }.bind(this));
    this.api.url = "https://swapi.co/api/people/";
  });
});
