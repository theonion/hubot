var turdward, videoIds;

var url = require('url');
var Tumblr = require('tumblrwks');
var youtubeRe = /https?:\/\/(www.)?(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)[&0-9a-zA-Z=]*/i;

var tumblr = new Tumblr({
  consumerKey: process.env.TURDWARD_CONSUMER_KEY,
  consumerSecret: process.env.TURDWARD_CONSUMER_SECRET,
  accessToken: process.env.TURDWARD_ACCESS_TOKEN,
  accessSecret: process.env.TURDWARD_ACCESS_SECRET
}, 'turdward.tumblr.com');
// var blog = new tumblr.Blog('turdward.tumblr.com', oauth);

module.exports = function(robot) {

  videoIds = robot.brain.get('turdward-videos') || [];

  return robot.hear(youtubeRe, function(msg) {
    return turdward(msg, function(id, text) {

      if(id) {
        videoIds.push(id);
        robot.brain.set('turdward-videos', videoIds);
      }
      if (text) {
        return msg.send(text);
      }
      
    });
  });
};

turdward = function(msg, cb) {
  var messageText = msg['message']['text'];
  var match = youtubeRe.exec(messageText);
  if (!match) {
    return cb();
  }

  var id = match[6];
  var url = match[0];

  if (videoIds.indexOf(id) !== -1) {  // We only want to share a video once
    return cb(null, 'That has already been posted!');
  }

  var caption = messageText.replace(youtubeRe, '');

  var options = {
    type: 'video',
    embed: url,
    caption: caption
  };
  // console.log(options);
  tumblr.post('/post', options, function(error, response){
    cb(id, "http://turdward.tumblr.com/post/" + response.id + "/");
  });

  return cb(caption + ' [' + id + ']');
};