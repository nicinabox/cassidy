class App.FooterView extends Backbone.View
  template: JST['footer']
  id: 'footer'
  className: 'col-sm-9 col-md-9 col-md-push-3 col-sm-push-3'

  initialize: ->

  render: ->
    @$el.html @template
    @el
