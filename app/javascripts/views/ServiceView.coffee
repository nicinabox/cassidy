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
    generator = App.views.generator
    @populateSettings()
    @model.setUsage().save()
    generator.$('[name=service]').val(@model.get('service')).trigger('change')
    generator.$('.result').select()

  populateSettings: ->
    app_settings = App.views.settings.model
    settings = @model.get('settings')
    if typeof settings == 'string'
      app_settings.set JSON.parse settings
    else
      app_settings.set settings

  clear: (e) ->
    @model.destroy()
    unless App.collections.services.length
      App.views.services.render()

    false
