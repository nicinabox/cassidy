class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'root'
    'welcome': 'welcome'

  render: (view) ->
    App.root.$el.html view.render()

  redirectTo: (path) ->
    @navigate path, trigger: true

  root: ->
    App.root = new App.ApplicationView

  welcome: ->
    @render new App.WelcomeView
