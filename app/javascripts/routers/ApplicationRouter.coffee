class App.ApplicationRouter extends Backbone.Router
  routes:
    '': 'application'
    'welcome': 'welcome'
    'beer': 'beer'
    'help': 'help'

  constructor: ->
    _.each @routes, (method, route) =>
      if @constructor::[method] == undefined
        @constructor::[method] = (options...) ->
          className = _.capitalize(method) + 'View'

          @render(new App[className], options...)

    super

  # Helpers
  render: (view) ->
    App.root.$el.html view.render()
    App.currentView = view
    _gauges.push(['track'])

  redirectTo: (path) ->
    @navigate path, trigger: true
