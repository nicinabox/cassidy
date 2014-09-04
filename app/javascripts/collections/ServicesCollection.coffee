class App.ServicesCollection extends Backbone.Collection
  model: App.ServiceModel

  setStorage: ->
    if Backbone.DropboxDatastore.client.isAuthenticated()
      @setRemoteStorage()
    else
      @setLocalStorage()

  setLocalStorage: ->
    delete @dropboxDatastore
    @localStorage = new Backbone.LocalStorage('services')

  setRemoteStorage: ->
    delete @localStorage
    @dropboxDatastore = new Backbone.DropboxDatastore('services')
    @dropboxDatastore.syncCollection(this)
    @sync = Backbone.cachingSync(Backbone.sync, 'services')

  initialize: ->
    @setStorage()

  comparator: 'service'

  sortByPopular: (a, b) ->
    orderA = a.get('usage')
    orderB = b.get('usage')

    if (orderA < orderB)
      return 1
    else if (orderA > orderB)
      return -1

    return 0

  syncLocalToRemote: ->
    originalCollection = this
    @setLocalStorage()

    @fetch
      success: (collection, response, options) ->
        remote = new App.ServicesCollection()
        collection.each (m) ->
          data = m.toJSON()
          delete data.id
          data.settings = JSON.stringify(data.settings)
          remote.create(data)

  toDataset: ->
    name: 'service'
    source: @serviceMatcher()

  serviceMatcher: ->
    return (query, cb) =>
      cb _(@pluck('service')).map((str) ->
        value: str if (new RegExp(query, "i").test(str))
      ).compact().value()

  stats: ->
    _.map @topServices(), (m) -> m.toJSON()

  topServices: (limit = 5) ->
    collection = new @constructor @reject((m) -> !m.get('usage')),
      comparator: @sortByPopular
    collection.first(limit)
