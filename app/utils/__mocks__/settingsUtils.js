'use strict';
var CryptoJS = require('crypto-js');
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

  createDefaultSettings: function() {
    return _.merge({}, this.defaults, {
      key: this.newKey()
    });
  },

  newKey: function() {
    return 'abc123'
  },

  encryptPhrase: function(str, key) {
    if (!str || !key) return;
    return 'lolencrypted';
  },

  decryptPhrase: function (str, key) {
    if (!str || !key) return;
    return 'juice';
  }
};

module.exports = settingsUtils;
