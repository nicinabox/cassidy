class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form': 'updateModel'
    'click .reset-settings': 'resetSettings'

  initialize: ->
    @model = new App.SettingsModel
    @listenTo @model, 'change', @render
    @passphraseView = new App.PassPhraseView

  render: ->
    @$el.html @template @model.attributes
    @$('.placeholder-passphrase').replaceWith @passphraseView.render()
    @el

  updateModel: (e) ->
    data = $(e.currentTarget).serializeObject()
    _.forEach data, (v, k) ->
      data[k] = true if v == 'on'

    @model.clear silent: true
    @model.set data
    @updateService()

  updateService: ->
    if App.views.generator.populated
      App.views.generator.saveService()

  resetSettings: (e) ->
    e.preventDefault()
    @model.clear silent: true
    @model.set @model.defaults
    @passphraseView.delegateEvents()
