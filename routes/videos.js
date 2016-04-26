var express = require('express');
var path = require('path');
var serveIndex = require('serve-index');

module.exports = function(app) {

  //app.use(express.static(path.join(__dirname, '..', 'flowplayer')));

  var basicAuth = require('basic-auth');

  var auth = function (req, res, next) {
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
      return unauthorized(res);
    };

    if (user.name === app.config.user && user.pass === app.config.password) {
      return next();
    } else {
      return unauthorized(res);
    };
  };

  function handleVideo(url, req, res) {
    res.writeHead(200, {'Content-Type': 'video/mp4'});

    var Transcoder = require('stream-transcoder');
    var stream = require('fs').createReadStream(url);
    new Transcoder(stream)
      .maxSize(1280, 720)
      .videoCodec('h264')
      .videoBitrate(1672 * 1000)
      .fps(25)
      .sampleRate(44100)
      .channels(2)
      .audioBitrate(128 * 1000)
      .format('mp4')
      .on('finish', function() {
        console.log("Sent", url);
      })
      .stream().pipe(res);
  }

  if(app.config.path) {
    app.use('*', function(req, res, next) {
      var url = req.originalUrl || req.url;
      console.log('>', url);
      if(/\.(mkv)$/gi.test(url)) {
        url = path.join(app.config.path, url.replace('/videos/', '/'));
        return handleVideo(decodeURIComponent(url), req, res);
      };
      next();
    });
    app.use('/videos', auth, serveIndex(app.config.path, {icons:true}));
    app.use('/videos', auth, express.static(app.config.path));
    return;
  }

  var router = express.Router();
  router.get('/', function(req, res, next) {
    res.send('No path configured');
  });
  app.use('/videos', router);
};

