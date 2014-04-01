class App.SettingsModel extends Backbone.Model
  localStorage: new Backbone.LocalStorage("default-settings")

  defaults: ->
    length: 20
    upper: true
    lower: true
    numbers: true
    symbols: true
    key: @newKey()

  initialize: ->
    @store = new App.Storage('settings')
    @setDefaults()

    @on 'change:key', (model) ->
      @store.set('defaults', model.attributes)

  newKey: ->
    time = new Date().getTime().toString()
    CryptoJS.PBKDF2(time, '', { keySize: 128/32 })
      .toString().substr(0, 5)

  setDefaults: ->
    defaults = @store.get('defaults')
    unless defaults
      @set 'key', @newKey(), silent: true
      defaults = @store.set('defaults', @attributes)

    @set defaults

  parse: (data) ->
    data[0] if data
