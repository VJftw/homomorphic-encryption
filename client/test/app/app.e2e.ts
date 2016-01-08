 /*
  * TODO: ES5 for now until I make a webpack plugin for protractor
  */
describe("App", function() {

  beforeEach(function() {
    browser.get("/");
  });

  it("should have a title", function() {
    var subject = browser.getTitle();
    var result  = "An Implementation of Homomorphic Encryption";
    expect(subject).toEqual(result);
  });

  it("should have the header that links back to the index", function() {
    var header = element(by.css("h2 a"));

    expect(header.getWebElement().getText()).toEqual("An Implementation of Homomorphic Encryption");
    expect(header.getWebElement().getAttribute("href")).toBeDefined();
  });

  it("should have a try button", function() {
    var button = element(by.css("home button"));
    expect(button.isPresent()).toEqual(true);
  });

  // it("should have <header>", function() {
  //  var subject = element(by.deepCss("app /deep/ header")).isPresent();
  //  var result  = true;
  //  expect(subject).toEqual(result);
  // });
  //
  // it("should have <main>", function() {
  //  var subject = element(by.deepCss("app /deep/ main")).isPresent();
  //  var result  = true;
  //  expect(subject).toEqual(result);
  // });
  //
  // it("should have <footer>", function() {
  //  var subject = element(by.deepCss("app /deep/ footer")).getText();
  //  var result  = "WebPack Angular 2 Starter by @AngularClass";
  //  expect(subject).toEqual(result);
  // });

});
