class window.Domains extends Backbone.Collection
  localStorage: new Store('domains')

  save: (obj) ->
    domains = _.pluck(App.Domains.toJSON(), 'url')
    unless _.include(domains, obj.url)
      @create(obj)