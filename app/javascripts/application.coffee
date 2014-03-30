window.App =
  views: {}
  models: {}
  collections: {}

  initialize: ->
    new App.ApplicationView

  noResults: (message) ->
    template = JST['no_results']
    template message: message
