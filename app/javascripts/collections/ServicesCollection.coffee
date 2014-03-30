class App.ServicesCollection extends Backbone.Collection
  model: App.ServiceModel
  localStorage: new Backbone.LocalStorage("services")

  comparator: (model) ->
    model.get('service')
