window.addEventListener 'load', ->
  new FastClick document.body
, false

window.app ||= {
  mobile: (/mobile/i).test(navigator.userAgent)
}

$ ->

  # Models
  app.Config = new Config

  # Collections
  app.Domains = new Domains

  # Views
  app.ConfigView = new ConfigView
    model: app.Config

  app.DomainsView = new DomainsView
  app.SecretView = new SecretView
  app.SwipeView = new SwipeView