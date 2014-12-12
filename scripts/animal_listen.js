var HtmlParser, Select, animalMe, randimalMe;

Select = require("soupselect").select;

HtmlParser = require("htmlparser");

module.exports = function(robot) {
  return robot.hear(/animal/i, function(msg) {
    return randimalMe(msg, function(url) {
      return msg.send(url);
    });
  });
};

randimalMe = function(msg, cb) {
  return msg.http("http://animalsbeingdicks.com/random").get()(function(err, res, body) {
    console.log(res.headers.location);
    return animalMe(msg, res.headers.location, function(location) {
      return cb(location);
    });
  });
};

animalMe = function(msg, location, cb) {
  return msg.http(location).get()(function(err, res, body) {
    var handler, img, parser;
    handler = new HtmlParser.DefaultHandler();
    parser = new HtmlParser.Parser(handler);
    parser.parseComplete(body);
    img = Select(handler.dom, "#content .post .entry img");
    console.log(img);
    return cb(img[0].attribs.src);
  });
};
