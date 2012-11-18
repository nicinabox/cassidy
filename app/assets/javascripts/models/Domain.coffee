class window.Domain extends Backbone.Model
  initialize: ->
    @bind 'error', (model, errors) ->
      # console.log errors

  validate: (attrs) ->
    errors = []
    domains = app.Domains.pluck 'url'

    if _.include(domains, attrs.url)
      errors.push "URL must be unique"

    if _.isEmpty attrs.url
      errors.push "URL cannot be blank"

    unless _.isEmpty(errors)
      errors
