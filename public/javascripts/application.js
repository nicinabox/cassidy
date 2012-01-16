(function() {
  var HatchpassView, SettingsList, SettingsView,
    __hasProp = Object.prototype.hasOwnProperty;

  window.Settings = Backbone.Model.extend({
    initialize: function() {
      return this.defaults.key = this.newKey();
    },
    defaults: {
      key: "",
      length: 10,
      caps: true,
      symbols: true,
      save_master: false,
      save_key: false,
      save_settings: false
    },
    newKey: function() {
      return Crypto.SHA1(new Date().getTime().toString()).substr(0, 5);
    }
  });

  SettingsList = Backbone.Collection.extend({
    model: Settings
  });

  SettingsView = Backbone.View.extend({
    el: $('#settings form'),
    events: {
      'change': 'saveSettings'
    },
    initialize: function() {
      return window.settings = new Settings;
    },
    localStorage: new Store("settings"),
    saveSettings: function() {
      this.settings = this.el.serializeObject();
      if (settings.defaults.save_settings) {
        localStorage.settings = JSON.stringify(this.settings);
      }
      return this.saveMaster();
    },
    saveMaster: function() {
      var master;
      master = $('#master').val();
      if (this.settings.save_master) {
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
      this.settings = settings.defaults;
      error = this.validate(this.attributes);
      if (!error) return this.create(this.attributes);
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
      return this.set({
        secret: Crypto.SHA1("" + this.attributes.master + ":" + this.attributes.domain).substr(0, this.settings.length)
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
      return $('input.required', this.el).each(function(index) {
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
