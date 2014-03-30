class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form': 'updateModel'
    'click .reset-settings': 'resetSettings'
    'click .clear-data': 'clearData'

  initialize: ->
    @model = new App.SettingsModel
    @listenTo @model, 'change', @render
    @passphraseView = new App.PassPhraseView

  render: ->
    @$el.html @template @model.attributes
    @$('.placeholder-passphrase').replaceWith @passphraseView.render()
    @passphraseView.delegateEvents()
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

  clearData: (e) ->
    e.preventDefault()
    if confirm 'Are you sure you want to clear all saved data?'
      localStorage.clear()
      window.location.reload()
