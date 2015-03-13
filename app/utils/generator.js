var Vault = require('vault');

var generator = function(settings, service) {
  var vault = new Vault(settings);
  return vault.generate(service.service);
};

module.exports = generator;
