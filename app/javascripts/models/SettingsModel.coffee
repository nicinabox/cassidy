class App.SettingsModel extends Backbone.Model
  defaults:
    length: 20
    upper: true
    lower: true
    numbers: true
    symbols: true

  initialize: ->
    @set 'key', @newKey()

  newKey: ->
    time = new Date().getTime().toString()
    CryptoJS.PBKDF2(time, '', { keySize: 128/32 })
      .toString().substr(0, 5)
