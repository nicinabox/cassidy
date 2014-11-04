class App.ApplicationRouter extends Backbone.Router
  routes:
    'welcome': 'welcome'

  render: (view) ->
    App.root.$el.html view.render()

  redirectTo: (path) ->
    @navigate path, trigger: true

  reloadPage: ->
    location.reload()

  welcome: ->
    @render new App.WelcomeView
