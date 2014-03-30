class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'
  tagName: 'form'

  render: ->
    @$el.html @template()
    @el
