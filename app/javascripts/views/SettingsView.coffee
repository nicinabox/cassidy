class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'
  tagName: 'form'

  initialize: ->
    @model = new App.SettingsModel
    @passphraseView = new App.PassPhraseView

  render: ->
    @$el.html @template @model.attributes
    @$el.append @passphraseView.render()
    @el
