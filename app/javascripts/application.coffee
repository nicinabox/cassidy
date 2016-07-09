window.addEventListener 'load', () ->
  FastClick.attach(document.body)
, false

window.App =
  views: {}
  models: {}
  collections: {}

  initialize: ->

    @models =
      phrase: new App.PhraseModel
      settings: new App.SettingsModel

    @collections =
      services: new App.ServicesCollection

    @router = new App.ApplicationRouter
    @root   = new App.RootView
    Backbone.history.start()

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
    _.defer ->
      answer = prompt message
      dfd.resolve(answer) if answer
    dfd.promise()

_.bindAll App
