Domains = Backbone.Collection.extend(
  model: App.Domain
  localStorage: new Store('domains')
)

App.Domains = new Domains