class App.HelpView extends Backbone.View
  id: 'help'
  template: JST['help']
  className: 'page'

  render: ->
    @$el.html @template()
    @el
