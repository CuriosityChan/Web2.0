var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:index');

module.exports = function(db) {
  /* GET detail page. */
  var userManager = require('../models/user')(db);

  var users = db.collection('users');
  //debug('users collection setup as: ', users);

  router.get('/regist', function(req, res, next) {
    res.render('regist', { title: '注册', user: {}});
  });

  router.post('/regist', function(req, res, next) {
    var user = req.body;
    userManager.checkUser(user)
      .then(userManager.createUser(user))
      .then(function() {
        var hour = 3600000;
        res.cookie('user', user, {maxAge: hour});
        //req.session.cookie.maxAge = hour;
        res.redirect('/detail');
      })
      .catch(function(error) {
        res.render('regist', { title: '注册', user: user, error: error.message });
      });
  });

  router.get('/signin', function(req, res, next) {
    res.render('signin', { title: '登录' });
  });

  router.post('/signin', function(req, res, next) {
    userManager.findUser(req.body.username, req.body.password)
      .then(function(user) {
        var hour = 3600000;
        res.cookie('user', user, {maxAge: hour});
        res.redirect('/detail');
      })
      .catch(function(error) {
        res.render('signin',{ title: '登录', error: '用户名或密码错误' });
      });
  });

  router.get('/signout', function(req, res, next) {
    res.clearCookie('user');
    //delete req.session.user;
    res.redirect('/signin');
  });

  router.post('/api/validate-unique', function(req, res, next) {
    userManager.validateUnique(req.body.field, req.body.value)
      .then(function() {
        res.send({ 'isUnique':true });
      })
      .catch(function(error) {
        res.send({ 'isUnique':false });
      });
  });

  router.all('*', function(req, res, next) {
    req.cookies.user? next() : res.redirect('/signin');
  });

  router.get('/detail', function(req, res, next) {
    var authorityError = req.session.authorityError;
    req.session.authorityError = null;
    res.render('detail', { title: '详情', error: authorityError, user: req.cookies.user });
  });

  router.post('/detail', function(req, res, next) {
    res.render('detail', { title: '详情', error: req.error, user: req.cookies.user });
  });

  router.get('/', function(req, res, next) {
    var username = req.query.username;
    if (username) {
      if (username != req.cookies.user.username) req.session.authorityError = '只能够访问自己的数据';
      res.redirect('/detail');
    } else {
      res.redirect('/detail');
    }
  });

  return router;
}