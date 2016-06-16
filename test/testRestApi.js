require("webcomponentsjs/webcomponents.min.js")

const assert = require("chai").assert;
const FakeRequest = require("./fakeRequest");

window.XMLHttpRequest = FakeRequest;


describe("rest-api", function() {

  beforeEach(function(done) {
    this.config = document.createElement("rest-config");
    this.el = document.createElement("rest-api");
    this.el.collectionParsePath = "results";
    this.testPanel.appendChild(this.config);
    this.testPanel.appendChild(this.el);
    FakeRequest.reset();

    HTMLImports.whenReady(function() {
      done();
    });
  });

  afterEach(function() {
    if (this.el) {
      this.testPanel.removeChild(this.el);
      delete this.el;
    }
    this.testPanel.innerHTML = "";
    localStorage.clear();
  });

  it("downloads data from a source", function(done) {
    this.el.addEventListener("data-changed", function() {
      assert.equal(this.el.data.length, 8);
      done();
    }.bind(this));
    this.el.endpoint = "https://swapi.co/api/people/";
  });
  it("uses local cache when remote data isn't available", function(done) {
    this.el.addEventListener("data-changed", function() {
      assert.equal(this.data[0], "one");
      done();
    });
    localStorage.stuff = '{"results": ["one"]}';
    this.el.cacheKey = "stuff";
  });
  it("handles network errors gracefully", function(done) {
    this.el.addEventListener("error", function(e) {
      assert.equal(e.detail, "Totally failed");
      done();
    });
    FakeRequest.error = "Totally failed";
    this.el.endpoint = "https://swapi.co/api/people/";
  });
  it("handles server errors gracefully", function(done) {
    this.el.addEventListener("error", function(e) {
      assert.equal(e.detail, "Totally failed");
      done();
    });
    FakeRequest.status = 500;
    FakeRequest.response = "Totally failed";
    this.el.endpoint = "https://swapi.co/api/people/";
  });
  it("handles parse errors gracefully", function(done) {
    this.el.addEventListener("error", function(e) {
      assert.equal(this.el.data, null);
      done();
    }.bind(this));
    this.el.collectionParsePath = "";
    this.el.endpoint = "https://swapi.co/api/people/";
  });
  it("has a fallback when cache and remote fail", function(done) {
    this.el.addEventListener("data-changed", function() {
      assert.equal(this.el.data[0], "one");
      done();
    }.bind(this));
    FakeRequest.status = 500;
    FakeRequest.response = "Totally failed";
    this.el.fallback = ["one"];
    this.el.cacheKey = "fudge";
    this.el.endpoint = "https://swapi.co/api/people/";
  });
  it("can fetch a single record", function() {
    this.el.data = [
      {id: 2, name: "Luke"},
      {id: 1, name: "Leia"},
    ];
    assert.equal(this.el.get({id:1}).name, "Leia");
  });
  it("can post new data", function() {
    this.el.data = this.el.parse(FakeRequest.response);
    return this.el.add({name: "Luke"}).then(function(e) {
      assert.equal(this.el.data.length, 9);
    }.bind(this));
  });
  it("can remove data from the api", function() {
    this.el.data = this.el.parse(FakeRequest.response);
    var leia = this.el.get({name: "Leia Organa"});
    return this.el.remove(leia).then(function(e) {
      assert.equal(this.el.data.length, 7);
    }.bind(this));
  });
  it("can put update data", function() {
    this.el.data = this.el.parse(FakeRequest.response);
    var leia = this.el.get({name: "Leia Organa"});
    leia.name = "Leia";
    return this.el.update(leia).then(function(e) {
      assert.equal(this.el.get({name: "Leia"}).name, "Leia");
    }.bind(this));
  });
  it("queues changes if the app isn't online, executes them when online", function () {
    this.el._testOnline = false;
    this.el.data = this.el.parse(FakeRequest.response);
    setTimeout(function() {
      this.el._testOnline = true;
      window.dispatchEvent(new CustomEvent("online"));
    }.bind(this), 20);
    return this.el.add({name: "Luke"}).then(function(e) {
      assert.equal(this.el.data.length, 9);
    }.bind(this));
  });

  it("uses an authentication token", function(done) {
    this.config.token = "token";
    var request = this.el.setupRequest({method: "GET"});
    assert.equal(request.headers.Authorization, "Token token");
    done();
  });
  xit("SOMEDAY: should be able to hook into websockets for instant updates");
});
