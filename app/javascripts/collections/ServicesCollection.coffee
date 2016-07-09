class App.ServicesCollection extends Backbone.Collection
  model: App.ServiceModel
  comparator: 'service'
  localStorage: new Backbone.LocalStorage("services")

  migrateStorage: ->
    if +localStorage.getItem('migration') < 1
      burry = new Burry.Store('services')
      ids = burry.get('__ids__')
      ids && _.each(ids, (id) => @create(burry.get(id)))
      localStorage.setItem('migration', 1)

  toDataset: ->
    name: 'service'
    source: @serviceMatcher()

  serviceMatcher: ->
    return (query, cb) =>
      cb _(@pluck('service')).map((str) ->
        value: str if (new RegExp(query, "i").test(str))
      ).compact().value()

  top: (limit = 5) ->
    items = @reject (m) -> !m.get('usage')
    items = _(items).sortBy((m) -> m.get('usage'))
              .last(limit).reverse().value()
    items

  resetUsage: ->
    @each (model) ->
      if model.get('usage')
        model.save usage: 0
