class App.PhraseModel extends Backbone.Model

  initialize: ->
    @store = new App.Storage('phrase')
    @set @store.get('phrase')

    @on 'change', (model) ->
      @store.set('phrase', model.attributes)
