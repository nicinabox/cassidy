window.app ||= {}

# Models
app.Domain = new Domain
app.Config = new Config

# Collections
app.Domains = new Domains
  model: app.Domain

# Views
app.AppView = new AppView
app.ConfigView = new ConfigView
  model: app.Config
app.SwipeView = new SwipeView
