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
    @$el.html @template()

  setupCollections: ->
    collections =
      services: new App.ServicesCollection

    _.each collections, (v, k) ->
      App.collections[k] = v
      v.fetch()

  setupViews: ->
    views =
      generator: new App.GeneratorView
      sidebar: new App.SidebarView
      footer: new App.FooterView

    _.each views, (v, k) =>
      App.views[k] = v
      @$('.row').append v.render()
      App.views[k].trigger("append.#{k}")

  disconnectDropbox: ->
    Backbone.DropboxDatastore.client.signOut {}, ->
      window.location.reload()

  connectDropbox: (e) ->
    e.preventDefault()

    if App.env == 'production' and window.location.protocol != 'https:'
       window.location.href = "https:" +
        window.location.href.substring(window.location.protocol.length)

    if @dropboxAuth
      @disconnectDropbox()
    else
      Backbone.DropboxDatastore.client.authenticate()
