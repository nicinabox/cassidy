class App.BeerView extends Backbone.View
  id: 'beer'
  template: JST['beer']
  className: 'page'

  render: ->
    @$el.html @template()
    @el
