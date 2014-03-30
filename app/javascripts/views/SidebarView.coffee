class App.SidebarView extends Backbone.View
  id: 'sidebar'
  className: 'col-sm-3'

  initialize: ->
    App.views.services = new App.ServicesView

  render: ->
    @setHeight()
    @$el.append App.views.services.render()
    @el

  setHeight: ->
    @$el.height($(window).height())
