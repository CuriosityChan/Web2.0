var bcrypt = require('bcrypt-as-promised');
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:user');
var __ = require('lodash');


module.exports = function(db) {
  var users = db.collection('users');

  return {
    findUser: function(username, password) {
      return users.findOne({'username': username}).then(function(user) {
        return user? bcrypt.compare(password, user.password).then(function() {
          return user;
        }) : Promise.reject('user doesn\'t exist');
      });
    },

    validateUnique: function(field, value) {
      var obj = {};
      obj[field] = value;
      return users.findOne(obj).then(function(user) {
        return user? Promise.reject('value is not unique') : user;
      });
    },

    createUser: function(user) {
      var iteration = 10;
      return bcrypt.hash(user.password, iteration).then(function(hash) {
        user.password = hash;
        return users.insert(user);
      });
    },

    checkUser: function(user) {
      var formatError = validator.findFormatErrors(user);
      return new Promise(function(resolve, reject) {
        formatError? reject(formatError) : resolve(user);
      }).then(function() {
        console.log(user);
        return users.findOne({$or: getQuery(user)}).then(function(foundUser) {
          debug('existed user: ', foundUser);
          return foundUser? Promise.reject('user isn\'t unique') : Promise.resolve(foundUser);
        });
      });
    }
  }

  function getQuery(user) {
    return __(user).omit('password').pairs().map(pairToObject).value();
  }

  function pairToObject(pair) {
    var obj = {};
    obj[pair[0]] = pair[1];
    return obj;
  }
}


