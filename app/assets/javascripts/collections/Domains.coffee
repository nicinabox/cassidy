Domains = Backbone.Collection.extend(
  model: App.Domain
  localStorage: new Store('domains')
  save: (obj) ->
    domains = _.pluck(App.Domains.toJSON(), 'url')
    unless _.include(domains, obj.url)
      @create(obj)

)

App.Domains = new Domains