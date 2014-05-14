class App.FooterView extends Backbone.View
  template: JST['footer']
  id: 'footer'

  initialize: ->
    $(window).resize _.debounce =>
      @setWidth()
    , 200

    @on 'append.footer', @setWidth
    @dropboxAuth = Backbone.DropboxDatastore.client.isAuthenticated()

  render: ->
    @$el.html @template
      connectedClass: if @dropboxAuth then 'connected' else ''
    @el

  setWidth: ->
    console.log $('#sidebar').outerWidth(true)
    @$el.width $(window).width() - $('#sidebar').outerWidth(true)
