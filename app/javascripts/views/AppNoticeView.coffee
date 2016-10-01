class App.AppNoticeView extends Backbone.View
  id: 'app-notice'
  className: 'alert alert-warning'
  template: JST['app_notice']

  render: ->
    @$el.html(@template())
    @el
