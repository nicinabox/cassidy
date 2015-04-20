'use strict';
var CryptoJS = require('crypto-js');
var { SHA256, PBKDF2, TripleDES, enc } = CryptoJS;
var _ = require('lodash');

var settingsUtils = {
  defaults: {
    length: 20,
    upper: true,
    lower: true,
    number: true,
    symbol: true,
    dash: true,
    space: false
  },

  toggleFields: {
    lower: 'Lowercase',
    upper: 'Uppercase',
    number: 'Numbers',
    dash: 'Dashes & underscore',
    symbol: 'Symbols',
    space: 'Spaces',
    require_always: 'Require always'
  },

  createDefaultSettings: function() {
    return _.merge({}, this.defaults, {
      key: this.newKey()
    });
  },

  newKey: function() {
    var time = new Date().getTime().toString() + Math.floor(Math.random() * 100000);
    return PBKDF2(time, '', {
      keySize: 128 / 32
    }).toString().substr(0, 5);
  },

  encryptPhrase: function(str, key) {
    if (!str || !key) return;
    var encrypted = TripleDES.encrypt(str, key);
    return encrypted.toString();
  },

  decryptPhrase: function(str, key) {
    if (!str || !key) return;

    try {
      var decrypted = TripleDES.decrypt(str, key);
      return decrypted.toString(enc.Utf8);
    } catch(e) {
      console.warn('Could not decrypt phrase.');
    }
  },

  coerceAttrsToBool: function(settings) {
    var attrs = ['upper', 'lower', 'number', 'symbol', 'dash', 'space'];
    _.each(attrs, function(attr) {
      if (!_.isBoolean(settings[attr])) {
        settings[attr] = !!settings[attr];
      }
    });
    return settings;
  },

  generateSalt: function () {
    return SHA256(new Date().getTime().toString()).toString();
  },
};

module.exports = settingsUtils;
