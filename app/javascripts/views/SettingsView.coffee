class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form': 'updateModel'

  initialize: ->
    @model = new App.SettingsModel
    @passphraseView = new App.PassPhraseView

  render: ->
    @$el.html @template @model.attributes
    @$el.append @passphraseView.render()
    @el

  updateModel: (e) ->
    data = $(e.currentTarget).serializeObject()
    _.forEach data, (v, k) ->
      data[k] = true if v == 'on'

    @model.clear silent: true
    @model.set data
