class App.ApplicationView extends Backbone.View
  className: 'container application'
  template: JST['application']

  events:
    'click .connect-dropbox': 'connectDropbox'

  initialize: ->
    @dropboxAuth = Backbone.DropboxDatastore.client.isAuthenticated()
    @setupCollections()

  render: ->
    @$el.html @template()
    @setupViews()
    @setupShortcuts()
    @el

  setupCollections: ->
    _.each App.collections, (c, k) ->
      c.fetch()

  setupViews: ->
    views =
      generator: new App.GeneratorView
      sidebar: new App.SidebarView
      footer: new App.FooterView

    _.each views, (v, k) =>
      App.views[k] = v
      @$('.row').append v.render()
      App.views[k].trigger("append.#{k}")

  setupShortcuts: ->
    App.shortcuts       = new App.Shortcuts
    App.views.shortcuts = new App.ShortcutsView
    @$el.append App.views.shortcuts.render()

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
