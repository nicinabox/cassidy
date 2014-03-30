class App.SidebarTabsView extends Backbone.View
  template: JST['sidebar_tabs_view']
  tagName: 'ul'
  className: 'nav nav-pills nav-justified'

  render: ->
    @$el.html @template()
    @el
