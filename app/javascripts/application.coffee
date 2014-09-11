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

  platform: (->
    return 'win' if /win/i.test(navigator.appVersion)
    return 'osx' if /mac/i.test(navigator.appVersion)
  )()

  isMobile: /mobile/i.test(navigator.userAgent)

  prompt: (message) ->
    dfd = $.Deferred()
    setTimeout ->
      answer = prompt message
      dfd.resolve(answer) if answer
    , 0
    dfd.promise()
