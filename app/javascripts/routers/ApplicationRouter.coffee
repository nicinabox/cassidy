class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'application'
    'welcome': 'welcome'

  # Helpers
  render: (view) ->
    App.root.$el.html view.render()

  redirectTo: (path) ->
    @navigate path, trigger: true

  # Routes
  application: ->
    @render new App.ApplicationView

  welcome: ->
    @render new App.WelcomeView
