class App.FooterView extends Backbone.View
  template: JST['footer']
  id: 'footer'

  initialize: ->
    @dropboxAuth = Backbone.DropboxDatastore.client.isAuthenticated()

  render: ->
    @$el.html @template
      connectedClass: if @dropboxAuth then 'connected' else ''
    @el
