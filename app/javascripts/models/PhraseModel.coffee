class App.PhraseModel extends Backbone.Model

  initialize: ->
    @store = new App.Storage('phrase')

    @on 'change', (model) ->
      @store.set('phrase', model.toJSON())

  fetch: ->
    @set @parse @store.get('phrase')

  toJSON: ->
    attrs = _.clone @attributes
    key = App.views.settings.model.get('key')
    phrase = @get('phrase')
    encrypted = CryptoJS.TripleDES.encrypt(phrase, key)
    _.extend attrs, phrase: encrypted.toString()

  parse: (data) ->
    return unless data
    key = App.views.settings.model.get('key')
    decrypted = CryptoJS.TripleDES.decrypt(data.phrase, key)
    data.phrase = decrypted.toString(CryptoJS.enc.Utf8)
    data
