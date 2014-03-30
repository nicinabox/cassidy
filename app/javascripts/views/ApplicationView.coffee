class App.ApplicationView extends Backbone.View
  template: JST['application']
  el: '#root'

  initialize: ->
    @render()
    @setupCollections()
    @setupViews()

  render: ->
    @$el.html @template()

  setupCollections: ->
    collections = {
      services: new App.ServicesCollection
    }

    _.each collections, (v, k) ->
      App.collections[k] = v

  setupViews: ->
    views = {
      sidebar: new App.SidebarView
      generator: new App.GeneratorView
    }

    _.each views, (v, k) =>
      App.views[k] = v
      @$('.row').append v.render()
