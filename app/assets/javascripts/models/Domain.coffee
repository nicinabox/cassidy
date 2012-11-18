class window.Domain extends Backbone.Model
  validate: (attrs) ->
    errors = []
    domains = app.Domains.pluck 'url'

    if _.include(domains, attrs.url)
      errors.push "URL must be unique"

    if _.isEmpty attrs.url
      errors.push "URL cannot be blank"

    if errors
      errors
