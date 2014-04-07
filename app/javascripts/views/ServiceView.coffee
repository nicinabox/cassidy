class App.ServiceView extends Backbone.View
  template: JST['service']
  tagName: 'a'
  attributes:
    href: '#'

  events:
    'click': 'populateGenerator'
    'click .remove': 'clear'

  initialize: ->
    @listenTo @model, 'destroy', @remove

  render: ->
    @$el.html @template @model.attributes
    @el

  populateGenerator: (e) ->
    e.preventDefault()

    @populateSettings()
    App.views.generator.populate(@model)

  populateSettings: ->
    App.views.settings.populate(@model)

  clear: (e) ->
    @model.destroy()
    unless App.collections.services.length
      App.views.services.render()

    false
