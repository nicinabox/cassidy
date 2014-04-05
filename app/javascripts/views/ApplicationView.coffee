class App.ApplicationView extends Backbone.View
  template: JST['application']
  el: '#root'

  events:
    'click .connect-dropbox': 'connectDropbox'

  initialize: ->
    @dropboxAuth = Backbone.DropboxDatastore.client.isAuthenticated()
    @render()
    @setupCollections()
    @setupViews()

  render: ->
    attrs =
      connectedClass: if @dropboxAuth then 'connected' else ''
    @$el.html @template attrs

  setupCollections: ->
    collections = {
      services: new App.ServicesCollection
    }

    _.each collections, (v, k) ->
      App.collections[k] = v
      v.fetch()

  setupViews: ->
    views = {
      generator: new App.GeneratorView
      sidebar: new App.SidebarView
    }

    _.each views, (v, k) =>
      App.views[k] = v
      @$('.row').append v.render()

  disconnectDropbox: ->
    Backbone.DropboxDatastore.client.signOut {}, ->
      window.location.reload()

  connectDropbox: (e) ->
    e.preventDefault()
    if @dropboxAuth
      @disconnectDropbox()
    else
      Backbone.DropboxDatastore.client.authenticate()
