window.app ||= {
  mobile: (/mobile/i).test(navigator.userAgent)
}

$ ->
  # Models
  app.Domain = new Domain
  app.Config = new Config

  # Collections
  app.Domains = new Domains
    model: app.Domain

  # Views
  app.ConfigView = new ConfigView
    model: app.Config

  app.DomainsView = new DomainsView
  app.SecretView = new SecretView
  app.SwipeView = new SwipeView