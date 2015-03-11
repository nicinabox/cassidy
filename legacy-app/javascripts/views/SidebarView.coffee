class App.SidebarView extends Backbone.View
  id: 'sidebar'
  template: JST['sidebar']
  className: 'col-sm-4 col-md-3 col-md-pull-6 col-sm-pull-7'

  initialize: ->
    App.views.sidebar_tabs = new App.SidebarTabsView
    App.views.services = new App.ServicesView
    App.views.settings = new App.SettingsView

  render: ->
    @$el.html @template()
    @$('.tab-content').before App.views.sidebar_tabs.render()
    @$('.tab-content').append App.views.services.render()
    @$('.tab-content').append App.views.settings.render()
    @el
