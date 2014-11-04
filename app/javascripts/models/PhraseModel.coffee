class App.PhraseModel extends Backbone.Model
  defaultPhrase: (->
    Math.random().toString(36).slice(2)
  )()

  initialize: ->
    @usingDefaultPhrase = false
    @store = new App.Storage('phrase')

    @on 'change', ->
      data = @toJSON()
      if data
        @store.set('phrase', data)
      else
        @store.remove('phrase')

  fetch: ->
    $.when(@settings.fetch()).then =>
      @set @parse(@store.get('phrase')),
        silent: true

  hasSavedPhrase: ->
    !!@store.get('phrase')

  toJSON: ->
    phrase = @get('phrase')

    if phrase
      attrs     = _.clone @attributes
      key       = App.views.settings.model.get('key')
      encrypted = CryptoJS.TripleDES.encrypt(phrase, key)
      _.extend attrs, phrase: encrypted.toString()

  parse: (data) ->
    return unless data
    key = App.views.settings.model.get('key')
    decrypted = CryptoJS.TripleDES.decrypt(data.phrase, key)
    data.phrase = decrypted.toString(CryptoJS.enc.Utf8)
    data
