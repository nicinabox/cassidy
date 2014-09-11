class App.ShortcutsView extends Backbone.View
  template: JST['shortcuts']
  id: 'shortcuts'
  className: 'modal'

  initialize: ->
    @$el.modal
      show: false

  toggle: ->
    @$el.modal('toggle')

  render: ->
    @$el.html @template()
    @el
