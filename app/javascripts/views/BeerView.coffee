class App.BeerView extends Backbone.View
  id: 'beer'
  template: JST['beer']

  render: ->
    @$el.html @template()
    @el
