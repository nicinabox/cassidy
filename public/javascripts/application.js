(function() {
  var HatchpassView,
    __hasProp = Object.prototype.hasOwnProperty;

  window.Settings = Backbone.Model.extend({
    defaults: {
      key: "",
      length: 10,
      caps: true,
      symbols: true,
      save_master: false,
      save_key: false,
      save_settings: false
    },
    initialize: function() {
      return this.defaults.key = this.newKey();
    },
    newKey: function() {
      return "fbb43";
    }
  });

  window.SettingsView = Backbone.View.extend({
    el: $('#settings'),
    localStorage: new Store("settings"),
    events: {
      'change input': 'saveSettings',
      'click .toggle-settings': 'togglePane'
    },
    initialize: function() {
      window.settings = new Settings().defaults;
      return this.load();
    },
    load: function() {
      var index, value, _results;
      _results = [];
      for (index in settings) {
        if (!__hasProp.call(settings, index)) continue;
        value = settings[index];
        switch ($("#" + index).attr('type')) {
          case "checkbox":
            $("#" + index).attr('checked', settings[index]);
            break;
          default:
            $("#" + index).val(settings[index]);
            break;
        }
      }
      return _results;
    },
    togglePane: function(e) {
      e.preventDefault();
      return $('form', this.el).toggle();
    },
    saveSettings: function() {
      this.settings = this.el.serializeObject();
      if (settings.save_settings) localStorage.settings = JSON.stringify(settings);
      return this.saveMaster();
    },
    saveMaster: function() {
      var master;
      master = $('#master').val();
      if (settings.save_master) {
        if (master.length > 0) return localStorage.master = master;
      } else {
        if (localStorage.master) return localStorage.removeItem('master');
      }
    }
  });

  window.Secret = Backbone.Model.extend({
    defaults: {
      master: '',
      domain: ''
    },
    initialize: function() {
      var error;
      this.bind('error', function(model, errors) {});
      error = this.validate(this.attributes);
      if (!error) return this.create();
    },
    validate: function(attrs) {
      var index, value;
      for (index in attrs) {
        if (!__hasProp.call(attrs, index)) continue;
        value = attrs[index];
        if (attrs[index].length === 0) return [index, "can't be blank"];
      }
    },
    create: function() {
      var domain, hash, host, item, key_num, nums, secret, secret_idx, sym_idx, symbols, this_upper, tld, _i, _len, _ref;
      symbols = "!@#]^&*(%[?${+=})_-|/<>".split('');
      domain = this.attributes.domain.toLowerCase();
      _ref = domain.split("."), host = _ref[0], tld = _ref[1];
      if (!tld) tld = 'com';
      hash = Crypto.SHA256("" + this.attributes.master + ":" + host + "." + tld);
      hash = Crypto.SHA256("" + hash + settings.key).substr(0, settings.length);
      nums = 0;
      key_num = hash.match(/\d/)[0];
      secret = hash.split(/(?:)/);
      this_upper = true;
      for (_i = 0, _len = secret.length; _i < _len; _i++) {
        item = secret[_i];
        if (item.match(/[a-zA-Z]/)) {
          if (settings.caps === true && !this_upper) {
            this_upper = true;
            secret[_i] = item.match(/[a-zA-Z]/)[0].toUpperCase();
          } else {
            this_upper = false;
          }
        } else {
          if (settings.symbols === true) {
            secret_idx = parseInt(_i + key_num / 3);
            sym_idx = nums + _i + (key_num * nums) + (1 * _i);
            if (!((secret[secret_idx] === null) || (secret_idx < 0) || (sym_idx < 0) || (symbols[sym_idx] === null) || (symbols[sym_idx] === void 0))) {
              secret[secret_idx] += symbols[sym_idx];
            }
          }
          nums += 1;
        }
      }
      secret = secret.join('').substr(0, settings.length);
      return this.set({
        secret: secret
      });
    }
  });

  HatchpassView = Backbone.View.extend({
    el: $('#new_secret form'),
    events: {
      'keyup input.required': 'newSecret'
    },
    initialize: function() {
      this.focus();
      return $('#secret:focus').select();
    },
    focus: function() {
      return $('input.required:visible', this.el).each(function(index) {
        if (this.value.length === 0) {
          $(this).focus();
          return false;
        }
      });
    },
    newSecret: function() {
      var hatchpass;
      hatchpass = new Secret({
        master: $('#master').val(),
        domain: $('#domain').val()
      });
      if (hatchpass) return $('#secret').val(hatchpass.get('secret'));
    }
  });

  window.HatchpassView = new HatchpassView;

  new SettingsView;

}).call(this);
