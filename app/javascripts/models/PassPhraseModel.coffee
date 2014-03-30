class App.PassPhraseModel extends Backbone.Model
  localStorage: new Backbone.LocalStorage("passphrase")

  parse: (data) ->
    data[0] if data
