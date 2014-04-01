class App.SettingsModel extends Backbone.Model
  localStorage: new Backbone.LocalStorage("default-settings")

  defaults: ->
    length: 20
    upper: 1
    lower: 1
    number: 1
    symbol: 1
    dash: 1
    space: 0
    key: @newKey()

  inverseDefaults: ->
    space: 0
    upper: 0
    lower: 0
    number: 0
    symbol: 0
    dash: 0

  protectedAttributes: ['key', 'phrase']

  initialize: ->
    @store = new App.Storage('settings')
    @setDefaults()

  save: (attr, value) ->
    if attr
      @set attr, value
      values = @store.get('defaults')
      values[attr] = value
      @store.set('defaults', values)
    else
      @store.set('defaults', @attributes)

  newKey: ->
    time = new Date().getTime().toString()
    CryptoJS.PBKDF2(time, '', { keySize: 128/32 })
      .toString().substr(0, 5)

  setDefaults: ->
    defaults = @store.get('defaults')
    unless defaults
      @set 'key', @newKey(), silent: true
      defaults = @save()

    @set _.merge @defaults(), defaults

  parse: (data) ->
    data[0] if data
