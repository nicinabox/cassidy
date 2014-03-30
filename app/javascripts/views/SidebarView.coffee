class App.SidebarView extends Backbone.View
  template: JST['sidebar']
  id: 'sidebar'
  className: 'col-sm-3'

  initialize: ->
    _.bindAll this, 'addService'

    @$el.html @template()

    @collection = App.collections.services
    @listenTo @collection, 'sync', @addServices
    @collection.fetch()

  render: ->
    @setHeight()
    @el

  setHeight: ->
    @$el.height($(window).height())

  addServices: ->
    @$('nav').empty()
    @collection.each @addService

  addService: (model) ->
    view = new App.ServiceView model: model
    @$('nav').append view.render()
