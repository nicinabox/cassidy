(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  window.Config = Backbone.Model.extend({
    localStorage: new Store("settings"),
    defaults: {
      key: '',
      length: 10,
      caps: true,
      symbols: true,
      save_settings: false,
      save_master: false,
      save_key: true
    },
    initialize: function() {
      return this.set({
        key: this.newKey()
      });
    },
    newKey: function() {
      return Crypto.SHA256(new Date().getTime().toString()).substr(0, 5);
    }
  });

  window.ConfigView = Backbone.View.extend({
    el: $('#settings'),
    tagName: "input",
    events: {
      'change input': 'saveConfig',
      'click .toggle-settings': 'togglePane'
    },
    initialize: function() {
      var self;
      this.model = new Config;
      self = this;
      return this.model.fetch({
        success: function(model, response) {
          self.model.unset('0');
          self.model.set(response[0]);
          return self.render();
        }
      });
    },
    render: function() {
      var config, index, value, _results;
      config = this.model.attributes;
      _results = [];
      for (index in config) {
        if (!__hasProp.call(config, index)) continue;
        value = config[index];
        switch ($("#" + index).attr('type')) {
          case "checkbox":
            $("#" + index).attr('checked', config[index]);
            break;
          default:
            $("#" + index).val(config[index]);
            break;
        }
      }
      return _results;
    },
    togglePane: function(e) {
      e.preventDefault();
      return $('form', this.el).slideToggle('fast');
    },
    saveConfig: function() {
      var config;
      config = $('form', this.el).serializeObject();
      if (config.save_settings) {
        this.model.save(config);
      } else {
        this.model.destroy();
      }
      this.saveMaster();
      return AppView.focus();
    },
    saveMaster: function() {
      var master;
      master = $('#master').val();
      if (this.model.get('save_master')) {
        if (master.length > 0 && localStorage.master !== master) {
          return this.model.save({
            master: master
          });
        }
      } else {
        this.model.unset('master');
        return this.model.save();
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
      var config, domain, hash, host, item, key_num, nums, secret, secret_idx, sym_idx, symbols, this_upper, tld, _i, _len, _ref;
      config = this.attributes.config;
      symbols = "!@#]^&*(%[?${+=})_-|/<>".split('');
      domain = this.attributes.domain.toLowerCase();
      _ref = domain.split("."), host = _ref[0], tld = _ref[1];
      if (!tld) tld = 'com';
      hash = Crypto.SHA256("" + this.attributes.master + ":" + host + "." + tld);
      hash = Crypto.SHA256("" + hash + config.key).substr(0, config.length);
      nums = 0;
      key_num = hash.match(/\d/)[0];
      secret = hash.split(/(?:)/);
      this_upper = true;
      for (_i = 0, _len = secret.length; _i < _len; _i++) {
        item = secret[_i];
        if (item.match(/[a-zA-Z]/)) {
          if (config.caps === true && !this_upper) {
            this_upper = true;
            secret[_i] = item.match(/[a-zA-Z]/)[0].toUpperCase();
          } else {
            this_upper = false;
          }
        } else {
          if (config.symbols === true) {
            secret_idx = parseInt(_i + key_num / 3);
            sym_idx = nums + _i + (key_num * nums) + (1 * _i);
            if (!((secret[secret_idx] === null) || (secret_idx < 0) || (sym_idx < 0) || (symbols[sym_idx] === null) || (symbols[sym_idx] === void 0))) {
              secret[secret_idx] += symbols[sym_idx];
            }
          }
          nums += 1;
        }
      }
      secret = secret.join('').substr(0, config.length);
      return this.set({
        secret: secret
      });
    }
  });

  window.AppView = Backbone.View.extend({
    el: $('#new_secret form'),
    events: {
      'change #master': 'toggle_master',
      'keyup input.required': 'render'
    },
    initialize: function() {
      ConfigView.model.bind('change', this.render, this);
      this.load_master();
      this.focus();
      return $('#secret:focus').select();
    },
    load_master: function() {
      return $('#master').val(ConfigView.model.get('master'));
    },
    focus: function() {
      return $('input.required:visible', this.el).each(function(index) {
        if (this.value.length === 0) {
          $(this).focus();
          return false;
        }
      });
    },
    toggle_master: function() {
      if (ConfigView.model.get('save_master')) return ConfigView.saveMaster();
    },
    render: function() {
      var config, hatchpass;
      config = ConfigView.model.toJSON();
      hatchpass = new Secret({
        master: $('#master').val(),
        domain: $('#domain').val(),
        config: config
      });
      if (hatchpass) return $('#secret').val(hatchpass.get('secret'));
    }
  });

  window.ConfigView = new ConfigView;

  window.AppView = new AppView;

}).call(this);
