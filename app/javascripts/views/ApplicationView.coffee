class App.ApplicationView extends Backbone.View
  template: JST['application']
  el: '#root'

  initialize: ->
    @render()

  render: ->
    @$el.html @template()
