var Vault = require('vault');
var _ = require('lodash');

var VaultExtended = function() {
  Vault.apply(this, arguments);
};

VaultExtended.prototype = _.assign({}, Vault.prototype, {
  generateWithKey: function(service, key) {
      if (this._required.length > this._length)
      throw new Error('Length too small to fit all required characters');

      if (this._allowed.length === 0)
        throw new Error('No characters available to create a password');

      var required = this._required.slice(),
          stream   = new VaultExtended.Stream(this._phrase, service, key, this.entropy()),
          result   = '',
          index, charset, previous, i, same;

      while (result.length < this._length) {
        index    = stream.generate(required.length);
        charset  = required.splice(index, 1)[0];
        previous = result.charAt(result.length - 1);
        i        = this._repeat - 1;
        same     = previous && (i >= 0);

        while (same && i--)
          same = same && result.charAt(result.length + i - this._repeat) === previous;
        if (same)
          charset = this.subtract([previous], charset.slice());

        index   = stream.generate(charset.length);
        result += charset[index];
      }

      return result;
  }
});


VaultExtended.Stream = function(phrase, service, key, entropy) {
  this._phrase  = phrase;
  this._service = service;

  var hash = Vault.createHash(phrase, service + Vault.UUID + key, 2 * entropy),
      bits = Vault.map(hash.split(''), Vault.toBits).join('').split('');

  this._bases = {
    '2': Vault.map(bits, function(s) { return parseInt(s, 2); })
  };
};

VaultExtended.Stream.prototype = Vault.Stream.prototype;

module.exports = VaultExtended;
