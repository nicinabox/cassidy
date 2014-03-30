class App.ServicesView extends Backbone.View
  tagName: 'nav'

  initialize: ->
    _.bindAll this, 'addService'

    @collection = App.collections.services
    @listenTo @collection, 'sync', @render
    @collection.fetch()

  render: ->
    @addServices()
    @el

  addServices: ->
    @$el.empty()
    @collection.each @addService

  addService: (model) ->
    view = new App.ServiceView model: model
    @$el.append view.render()
