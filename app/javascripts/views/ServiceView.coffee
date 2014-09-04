class App.ServiceView extends Backbone.View
  template: JST['service']
  tagName: 'a'
  attributes:
    href: '#'

  events:
    'click': 'populate'
    'click .remove': 'clear'

  initialize: ->
    @listenTo @model, 'destroy', @remove

  render: ->
    @$el.html @template @model.attributes
    @el

  populate: (e) ->
    e.preventDefault()
    App.views.settings.populate(@model)
    App.views.generator.populate(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopImmediatePropagation()
    confirmed = confirm "Really remove #{@model.get('service')}?"
    return unless confirmed

    @model.destroy()
