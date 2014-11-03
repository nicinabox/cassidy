class App.ServiceModel extends Backbone.Model
  visible: true

  validate: (attrs) ->
    errors = []

    if attrs.service == ''
      errors.push "Service can't be blank"

    if @serviceExists(attrs.service)
      errors.push "Service must be unique"

    errors if errors.length

  serviceExists: (name) ->
    services = App.collections.services
    matching_services = services.where service: name
    matching_services.length > 1

  setUsage: ->
    usage = @get('usage') || 0
    @set usage: usage + 1
    this
