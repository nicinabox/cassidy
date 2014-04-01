(function() {
  window.addEventListener('load', function() {
    return FastClick.attach(document.body);
  }, false);

  window.App = {
    views: {},
    models: {},
    collections: {},
    initialize: function() {
      return new App.ApplicationView;
    },
    noResults: function(message) {
      var template;
      template = JST['no_results'];
      return template({
        message: message
      });
    },
    setPlatform: function() {
      if (/win/i.test(navigator.appVersion)) {
        this.platform = 'win';
      }
      if (/mac/i.test(navigator.appVersion)) {
        return this.platform = 'osx';
      }
    },
    isMobile: /mobile/i.test(navigator.userAgent)
  };

}).call(this);

(function() {
  $(App.initialize);

}).call(this);

(function() {
  App.Storage = (function() {
    function Storage(namespace) {
      this.namespace = namespace;
    }

    Storage.prototype.set = function(key, value) {
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      localStorage.setItem(this.namespacedKey(key), value);
      return this.get(key);
    };

    Storage.prototype.get = function(key) {
      var data, e;
      data = localStorage.getItem(this.namespacedKey(key));
      try {
        return JSON.parse(data);
      } catch (_error) {
        e = _error;
        return data;
      }
    };

    Storage.prototype.clear = function() {
      return localStorage.clear();
    };

    Storage.prototype.namespacedKey = function(key) {
      return [this.namespace, key].filter(function(n) {
        return n;
      }).join('_');
    };

    return Storage;

  })();

}).call(this);

(function() {
  App.Generator = (function() {
    function Generator(data) {
      var e;
      try {
        this.result = new App.Vault(data.settings).generate_with_key(data.service, data.settings.key);
      } catch (_error) {
        e = _error;
        this.error = e;
      }
    }

    return Generator;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.PhraseModel = (function(_super) {
    __extends(PhraseModel, _super);

    function PhraseModel() {
      return PhraseModel.__super__.constructor.apply(this, arguments);
    }

    PhraseModel.prototype.initialize = function() {
      this.store = new App.Storage('phrase');
      this.set(this.store.get('phrase'));
      return this.on('change', function(model) {
        return this.store.set('phrase', model.attributes);
      });
    };

    return PhraseModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.ServiceModel = (function(_super) {
    __extends(ServiceModel, _super);

    function ServiceModel() {
      return ServiceModel.__super__.constructor.apply(this, arguments);
    }

    ServiceModel.prototype.validate = function(attrs) {
      var errors;
      errors = [];
      if (attrs.service === '') {
        errors.push("Service can't be blank");
      }
      if (this.serviceExists(attrs.service)) {
        errors.push("Service must be unique");
      }
      if (errors.length) {
        return errors;
      }
    };

    ServiceModel.prototype.serviceExists = function(name) {
      var matching_services, services;
      services = App.collections.services;
      matching_services = services.where({
        service: name
      });
      return matching_services.length > 1;
    };

    return ServiceModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.SettingsModel = (function(_super) {
    __extends(SettingsModel, _super);

    function SettingsModel() {
      return SettingsModel.__super__.constructor.apply(this, arguments);
    }

    SettingsModel.prototype.localStorage = new Backbone.LocalStorage("default-settings");

    SettingsModel.prototype.defaults = function() {
      return {
        length: 20,
        upper: 1,
        lower: 1,
        number: 1,
        symbol: 1,
        dash: 1,
        space: 0,
        key: this.newKey()
      };
    };

    SettingsModel.prototype.inverseDefaults = function() {
      return {
        space: 0,
        upper: 0,
        lower: 0,
        number: 0,
        symbol: 0,
        dash: 0
      };
    };

    SettingsModel.prototype.protectedAttributes = ['key', 'phrase'];

    SettingsModel.prototype.initialize = function() {
      this.store = new App.Storage('settings');
      return this.setDefaults();
    };

    SettingsModel.prototype.save = function(attr, value) {
      var values;
      if (attr) {
        this.set(attr, value);
        values = this.store.get('defaults');
        values[attr] = value;
        return this.store.set('defaults', values);
      } else {
        return this.store.set('defaults', this.attributes);
      }
    };

    SettingsModel.prototype.newKey = function() {
      var time;
      time = new Date().getTime().toString();
      return CryptoJS.PBKDF2(time, '', {
        keySize: 128 / 32
      }).toString().substr(0, 5);
    };

    SettingsModel.prototype.setDefaults = function() {
      var defaults;
      defaults = this.store.get('defaults');
      if (!defaults) {
        this.set('key', this.newKey(), {
          silent: true
        });
        defaults = this.save();
      }
      return this.set(_.merge(this.defaults(), defaults));
    };

    SettingsModel.prototype.parse = function(data) {
      if (data) {
        return data[0];
      }
    };

    return SettingsModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Vault = (function(_super) {
    __extends(Vault, _super);

    function Vault() {
      return Vault.__super__.constructor.apply(this, arguments);
    }

    Vault.prototype.generate_with_key = function(service, key) {
      var charset, i, index, previous, required, result, same, stream;
      if (this._required.length > this._length) {
        throw new Error("Length too small to fit all required characters");
      }
      if (this._allowed.length === 0) {
        throw new Error("No characters available to create a password");
      }
      required = this._required.slice();
      stream = new App.Vault.Stream(this._phrase, service, key, this.entropy());
      result = "";
      index = void 0;
      charset = void 0;
      previous = void 0;
      i = void 0;
      same = void 0;
      while (result.length < this._length) {
        index = stream.generate(required.length);
        charset = required.splice(index, 1)[0];
        previous = result.charAt(result.length - 1);
        i = this._repeat - 1;
        same = previous && (i >= 0);
        while (same && i--) {
          same = same && result.charAt(result.length + i - this._repeat) === previous;
        }
        if (same) {
          charset = this.subtract([previous], charset.slice());
        }
        index = stream.generate(charset.length);
        result += charset[index];
      }
      return result;
    };

    return Vault;

  })(Vault);

  App.Vault.Stream = (function(_super) {
    __extends(Stream, _super);

    function Stream(phrase, service, key, entropy) {
      var bits, hash;
      this._phrase = phrase;
      this._service = service;
      hash = Vault.createHash(phrase, service + Vault.UUID + key, 2 * entropy);
      bits = Vault.map(hash.split(""), Vault.toBits).join("").split("");
      this._bases = {
        2: Vault.map(bits, function(s) {
          return parseInt(s, 2);
        })
      };
      return;
    }

    return Stream;

  })(Vault.Stream);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.ServicesCollection = (function(_super) {
    __extends(ServicesCollection, _super);

    function ServicesCollection() {
      return ServicesCollection.__super__.constructor.apply(this, arguments);
    }

    ServicesCollection.prototype.model = App.ServiceModel;

    ServicesCollection.prototype.localStorage = new Backbone.LocalStorage("services");

    ServicesCollection.prototype.comparator = function(model) {
      return model.get('service');
    };

    ServicesCollection.prototype.toDataset = function() {
      return {
        name: 'service',
        source: this.substringMatcher(this.pluck('service'))
      };
    };

    ServicesCollection.prototype.substringMatcher = function(strs) {
      var findMatches;
      return findMatches = function(q, cb) {
        var matches, substrRegex, substringRegex;
        matches = void 0;
        substringRegex = void 0;
        matches = [];
        substrRegex = new RegExp(q, "i");
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push({
              value: str
            });
          }
        });
        cb(matches);
      };
    };

    return ServicesCollection;

  })(Backbone.Collection);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.ApplicationView = (function(_super) {
    __extends(ApplicationView, _super);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.template = JST['application'];

    ApplicationView.prototype.el = '#root';

    ApplicationView.prototype.initialize = function() {
      this.render();
      this.setupCollections();
      return this.setupViews();
    };

    ApplicationView.prototype.render = function() {
      return this.$el.html(this.template());
    };

    ApplicationView.prototype.setupCollections = function() {
      var collections;
      collections = {
        services: new App.ServicesCollection
      };
      return _.each(collections, function(v, k) {
        App.collections[k] = v;
        return v.fetch();
      });
    };

    ApplicationView.prototype.setupViews = function() {
      var views;
      views = {
        generator: new App.GeneratorView,
        sidebar: new App.SidebarView
      };
      return _.each(views, (function(_this) {
        return function(v, k) {
          App.views[k] = v;
          return _this.$('.row').append(v.render());
        };
      })(this));
    };

    return ApplicationView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.GeneratorView = (function(_super) {
    __extends(GeneratorView, _super);

    function GeneratorView() {
      return GeneratorView.__super__.constructor.apply(this, arguments);
    }

    GeneratorView.prototype.template = JST['generator'];

    GeneratorView.prototype.id = 'generator';

    GeneratorView.prototype.className = 'col-sm-7 col-md-6 col-md-push-4 col-sm-push-5';

    GeneratorView.prototype.events = {
      'submit form': 'generatePassword',
      'change input[name=service]': 'generatePassword',
      'keyup input[name=service]': 'submitForm',
      'click .clear': 'clearForm',
      'click .result': 'selectResult',
      'focus .result': 'toggleHint',
      'blur .result': 'toggleHint',
      'keydown .result': 'preventChange',
      'cut .result': 'preventChange'
    };

    GeneratorView.prototype.initialize = function() {
      return this.listenForEscape();
    };

    GeneratorView.prototype.render = function() {
      this.$el.html(this.template());
      this.typeahead();
      this.removeReadonlyOnMobile();
      this.setSuperKey();
      return this.el;
    };

    GeneratorView.prototype.typeahead = function() {
      return this.$('input[name=service]').typeahead({
        highlight: true
      }, App.collections.services.toDataset());
    };

    GeneratorView.prototype.updateTypeahead = function() {
      this.$('input[name=service]').typeahead('destroy');
      return this.typeahead();
    };

    GeneratorView.prototype.submitForm = function(e) {
      this.toggleBorderClass();
      if (e.which === 13) {
        this.$('input[name=service]').typeahead('close');
        this.selectResult();
        this.saveService();
      }
      if (e.target.value) {
        return $(e.target.form).trigger('submit');
      } else {
        return this.clearForm();
      }
    };

    GeneratorView.prototype.generatePassword = function(e) {
      var data, generator;
      if (e) {
        e.preventDefault();
      }
      if (!this.$('[name=service]').val().length) {
        return;
      }
      this.toggleClearButton();
      data = this.serviceData();
      generator = new App.Generator(data);
      return this.$('.result').val(generator.result || generator.error);
    };

    GeneratorView.prototype.saveService = function(e) {
      var data, model, settings;
      settings = App.views.settings.model;
      data = this.serviceData();
      _.each(settings.protectedAttributes, function(attr) {
        return delete data.settings[attr];
      });
      model = App.collections.services.where({
        service: data.service
      })[0];
      if (model) {
        model.save(data);
      } else {
        model = App.collections.services.create(data);
        if (!model.isValid()) {
          model.destroy();
        }
      }
      return this.updateTypeahead();
    };

    GeneratorView.prototype.selectResult = function(e) {
      var $result;
      if (e) {
        e.preventDefault();
      }
      $result = this.$('.result');
      return $result[0].setSelectionRange(0, $result[0].value.length);
    };

    GeneratorView.prototype.preventChange = function(e) {
      return false;
    };

    GeneratorView.prototype.setSuperKey = function() {
      if (App.platform === 'win') {
        return this.$('.super-key').text('Ctrl+');
      }
    };

    GeneratorView.prototype.clearForm = function(e) {
      if (e) {
        e.preventDefault();
      }
      this.$('form')[0].reset();
      this.toggleClearButton();
      App.views.settings.resetSettings();
      return this.$('[name=service]').focus();
    };

    GeneratorView.prototype.toggleBorderClass = function() {
      return this.$('[name=service]').toggleClass('no-border-radius', this.$('.tt-dropdown-menu').is(':visible'));
    };

    GeneratorView.prototype.toggleClearButton = function() {
      return this.$('.clear').toggle(!!this.$('[name=service]').val().length);
    };

    GeneratorView.prototype.toggleHint = function() {
      return this.$('.hint').toggleClass('visible');
    };

    GeneratorView.prototype.listenForEscape = function() {
      return $(document).on('keyup', (function(_this) {
        return function(e) {
          if (e.which === 27) {
            return _this.clearForm();
          }
        };
      })(this));
    };

    GeneratorView.prototype.populated = function() {
      return !!this.$('[name=service]').val().length;
    };

    GeneratorView.prototype.removeReadonlyOnMobile = function() {
      if (!App.isMobile) {
        return;
      }
      return this.$('.result').removeAttr('readonly');
    };

    GeneratorView.prototype.serviceData = function() {
      var form_data, settings, settingsView;
      settingsView = App.views.settings;
      form_data = this.$('form').serializeObject();
      settings = _.merge(settingsView.model.attributes, settingsView.phraseView.model.attributes);
      return _.merge(form_data, {
        settings: settings
      });
    };

    return GeneratorView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.PhraseView = (function(_super) {
    __extends(PhraseView, _super);

    function PhraseView() {
      return PhraseView.__super__.constructor.apply(this, arguments);
    }

    PhraseView.prototype.template = JST['phrase'];

    PhraseView.prototype.events = {
      'change input': 'save',
      'click .toggle-visibility': 'toggleInputType'
    };

    PhraseView.prototype.initialize = function() {
      return this.model = new App.PhraseModel;
    };

    PhraseView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      return this.el;
    };

    PhraseView.prototype.save = function(e) {
      var val;
      if (e.type === 'keyup' && e.which !== 13) {
        return;
      }
      val = e.target.value;
      this.model.set('phrase', val);
      return App.views.settings.updateService();
    };

    PhraseView.prototype.toggleInputType = function(e) {
      var $target;
      e.preventDefault();
      $target = $(e.target);
      return this.$('input').attr('type', function(i, attr) {
        if (attr === 'password') {
          $target.text('Hide');
          return 'text';
        } else {
          $target.text('Show');
          return 'password';
        }
      });
    };

    return PhraseView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.ServiceView = (function(_super) {
    __extends(ServiceView, _super);

    function ServiceView() {
      return ServiceView.__super__.constructor.apply(this, arguments);
    }

    ServiceView.prototype.template = JST['service'];

    ServiceView.prototype.tagName = 'a';

    ServiceView.prototype.attributes = {
      href: '#'
    };

    ServiceView.prototype.events = {
      'click': 'populateGenerator',
      'click .remove': 'clear'
    };

    ServiceView.prototype.initialize = function() {
      return this.listenTo(this.model, 'destroy', this.remove);
    };

    ServiceView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      return this.el;
    };

    ServiceView.prototype.populateGenerator = function(e) {
      var generator;
      e.preventDefault();
      generator = App.views.generator;
      this.populateSettings();
      generator.$('[name=service]').val(this.model.get('service')).trigger('change');
      return generator.$('.result').select();
    };

    ServiceView.prototype.populateSettings = function() {
      var settings;
      settings = App.views.settings.model;
      return settings.set(this.model.get('settings'));
    };

    ServiceView.prototype.clear = function(e) {
      this.model.destroy();
      if (!App.collections.services.length) {
        App.views.services.render();
      }
      return false;
    };

    return ServiceView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.ServicesView = (function(_super) {
    __extends(ServicesView, _super);

    function ServicesView() {
      return ServicesView.__super__.constructor.apply(this, arguments);
    }

    ServicesView.prototype.id = 'services';

    ServicesView.prototype.className = 'tab-pane active';

    ServicesView.prototype.tagName = 'nav';

    ServicesView.prototype.initialize = function() {
      _.bindAll(this, 'addService');
      this.collection = App.collections.services;
      return this.listenTo(this.collection, 'sync', this.render);
    };

    ServicesView.prototype.render = function() {
      if (this.collection.length) {
        this.addServices();
      } else {
        this.$el.html(App.noResults('Your recent services appear here.'));
      }
      return this.el;
    };

    ServicesView.prototype.addServices = function() {
      this.$el.empty();
      return this.collection.each(this.addService);
    };

    ServicesView.prototype.addService = function(model) {
      var view;
      view = new App.ServiceView({
        model: model
      });
      return this.$el.append(view.render());
    };

    return ServicesView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.SettingsView = (function(_super) {
    __extends(SettingsView, _super);

    function SettingsView() {
      return SettingsView.__super__.constructor.apply(this, arguments);
    }

    SettingsView.prototype.template = JST['settings'];

    SettingsView.prototype.id = 'settings';

    SettingsView.prototype.className = 'tab-pane';

    SettingsView.prototype.events = {
      'change form': 'updateSettings',
      'click .reset-settings': 'resetSettings',
      'click .clear-data': 'clearData'
    };

    SettingsView.prototype.initialize = function() {
      this.model = new App.SettingsModel;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change:key', function(model, value) {
        return this.model.save('key', value);
      });
      return this.phraseView = new App.PhraseView;
    };

    SettingsView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      this.$('.placeholder-passphrase').replaceWith(this.phraseView.render());
      this.phraseView.delegateEvents();
      return this.el;
    };

    SettingsView.prototype.updateSettings = function(e) {
      var data, defaults;
      data = $(e.currentTarget).serializeObject();
      defaults = this.model.defaults();
      _.forEach(data, function(v, k) {
        if (v === 'on') {
          return data[k] = defaults[k];
        }
      });
      data = _.merge(this.model.inverseDefaults(), data);
      this.model.clear({
        silent: true
      });
      this.model.set(data, {
        silent: true
      });
      return this.updateService();
    };

    SettingsView.prototype.updateService = function() {
      var generator;
      generator = App.views.generator;
      if (typeof generator.populated === "function" ? generator.populated() : void 0) {
        generator.saveService();
        return generator.generatePassword();
      } else {
        return this.model.save();
      }
    };

    SettingsView.prototype.resetSettings = function(e) {
      if (e) {
        e.preventDefault();
      }
      this.model.clear({
        silent: true
      });
      this.model.setDefaults();
      return this.updateService();
    };

    SettingsView.prototype.clearData = function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to clear all saved data?')) {
        localStorage.clear();
        return window.location.reload();
      }
    };

    return SettingsView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.SidebarTabsView = (function(_super) {
    __extends(SidebarTabsView, _super);

    function SidebarTabsView() {
      return SidebarTabsView.__super__.constructor.apply(this, arguments);
    }

    SidebarTabsView.prototype.template = JST['sidebar_tabs_view'];

    SidebarTabsView.prototype.tagName = 'ul';

    SidebarTabsView.prototype.className = 'nav nav-pills nav-justified';

    SidebarTabsView.prototype.render = function() {
      this.$el.html(this.template());
      return this.el;
    };

    return SidebarTabsView;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.SidebarView = (function(_super) {
    __extends(SidebarView, _super);

    function SidebarView() {
      return SidebarView.__super__.constructor.apply(this, arguments);
    }

    SidebarView.prototype.id = 'sidebar';

    SidebarView.prototype.template = JST['sidebar'];

    SidebarView.prototype.className = 'col-sm-4 col-md-3 col-md-pull-6 col-sm-pull-7';

    SidebarView.prototype.initialize = function() {
      _.bindAll(this, 'setHeight');
      $(window).resize(this.setHeight);
      App.views.sidebar_tabs = new App.SidebarTabsView;
      App.views.services = new App.ServicesView;
      return App.views.settings = new App.SettingsView;
    };

    SidebarView.prototype.render = function() {
      this.setHeight();
      this.$el.html(this.template());
      this.$('.tab-content').before(App.views.sidebar_tabs.render());
      this.$('.tab-content').append(App.views.services.render());
      this.$('.tab-content').append(App.views.settings.render());
      return this.el;
    };

    SidebarView.prototype.setHeight = function() {
      return this.$el.outerHeight($(window).height(), true);
    };

    return SidebarView;

  })(Backbone.View);

}).call(this);

(function() {
  Handlebars.registerHelper('checked', function(attr) {
    if (attr) {
      return 'checked';
    }
  });

}).call(this);
