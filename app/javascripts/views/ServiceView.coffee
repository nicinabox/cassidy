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
    view = App.views.generator
    @populateSettings()
    view.$('[name=service]').val @model.get('service')

  populateSettings: ->
    settings = App.views.settings.model
    settings.clear silent: true
    settings.set @model.get('settings')

  clear: (e) ->
    @model.destroy()
    unless App.collections.services.length
      App.views.services.render()

    false
