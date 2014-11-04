class App.HelpView extends Backbone.View
  id: 'help'
  template: JST['help']

  render: ->
    @$el.html @template()
    @el
