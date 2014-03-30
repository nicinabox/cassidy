class App.SidebarView extends Backbone.View
  id: 'sidebar'
  template: JST['sidebar']
  className: 'col-sm-3'

  initialize: ->
    App.views.sidebar_tabs = new App.SidebarTabsView
    App.views.services = new App.ServicesView
    App.views.settings = new App.SettingsView

  render: ->
    @setHeight()
    @$el.html @template()
    @$('.tab-content').before App.views.sidebar_tabs.render()
    @$('.tab-content').append App.views.services.render()
    @$('.tab-content').append App.views.settings.render()
    @el

  setHeight: ->
    @$el.height($(window).height())
