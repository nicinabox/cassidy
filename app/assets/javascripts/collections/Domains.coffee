class window.Domains extends Backbone.Collection
  localStorage: new Store('domains')
  model: Domain