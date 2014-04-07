class App.ServicesView extends Backbone.View
  id: 'services'
  className: 'tab-pane active'
  tagName: 'nav'
  statsTemplate: JST['stats']

  initialize: ->
    _.bindAll this, 'addService'

    @collection = App.collections.services
    @listenTo @collection, 'sync', @render

  render: ->
    if @collection.length
      @addServices()
      App.views.generator.focus()
    else
      @$el.html App.noResults('Your recent services appear here.')

    @el

  addServices: ->
    @$el.empty()
    @collection.each @addService
    @$el.append @statsTemplate(@collection.stats())

  addService: (model) ->
    view = new App.ServiceView model: model
    @$el.append view.render()

