window.addEventListener 'load', () ->
  FastClick.attach(document.body)
, false

window.App =
  views: {}
  models: {}
  collections: {}

  initialize: ->
    dropbox = new App.DropboxClient
    Backbone.DropboxDatastore.client = dropbox.client

    new App.ApplicationView

  noResults: (message) ->
    template = JST['no_results']
    template message: message

  setPlatform: ->
    if /win/i.test(navigator.appVersion)
      @platform = 'win'

    if /mac/i.test(navigator.appVersion)
      @platform = 'osx'

  isMobile: /mobile/i.test(navigator.userAgent)
