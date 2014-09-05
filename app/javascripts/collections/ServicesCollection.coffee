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

  top: (limit = 5) ->
    items = @reject (m) -> !m.get('usage')
    items = _(items).sortBy((m) -> m.get('usage'))
              .last(limit).reverse().value()
    items

  resetUsage: ->
    @each (model) ->
      if model.get('usage')
        model.save usage: 0
