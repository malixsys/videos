var express = require('express');
var serveIndex = require('serve-index');



module.exports = function(app) {
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

  var path = require('path');
  if(app.config.path) {
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

