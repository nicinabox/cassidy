class window.Domains extends Backbone.Collection
  localStorage: new Store('domains')

  save: (obj) ->
    domains = _.pluck(app.Domains.toJSON(), 'url')
    unless _.include(domains, obj.url)
      @create(obj)