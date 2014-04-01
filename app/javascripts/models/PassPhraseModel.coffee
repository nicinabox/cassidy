class App.PassPhraseModel extends Backbone.Model

  initialize: ->
    @store = new App.Storage
    @set @store.get('passphrase')

    @on 'change', (model) ->
      @store.set('passphrase', model.attributes)
