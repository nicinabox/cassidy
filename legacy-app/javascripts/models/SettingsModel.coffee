class App.SettingsModel extends Backbone.Model
  protectedAttributes: ['key', 'phrase']

  # Fallback on localStorage
  setStorage: ->
    if Backbone.DropboxDatastore.client.isAuthenticated()
      @dropboxStore = Backbone.DropboxDatastore.client
    else
      @store = new App.Storage('settings')

  defaults: ->
    length: 20
    upper: true
    lower: true
    number: true
    symbol: true
    dash: true
    space: false
    key: @newKey()

  initialize: ->
    @setStorage()

  fetch: ->
    return @fetchStore() if @store
    return @fetchDropbox() if @dropboxStore

  saveKey: ->
    if @store
      attrs = @store.get('defaults')
      attrs.key = @get('key')
      @store.set('defaults', attrs)

    if @dropboxStore
      if !@result
        results = @table.query()
        @result = results[0]

      if @result.getFields().key != @get('key')
        @result.set 'key', @get('key')

  newKey: ->
    time = new Date().getTime().toString() + Math.floor(Math.random() * 100000)
    CryptoJS.PBKDF2(time, '', { keySize: 128/32 })
      .toString().substr(0, 5)

  resetOptions: ->
    defaults = @defaults()
    delete defaults.key
    @set defaults
    @trigger('sync')

  resetAllDefaults: ->
    @set @defaults()
    @saveKey()
    @trigger('sync')

  fetchStore: ->
    dfd = $.Deferred()

    defaults = @store.get('defaults')
    if defaults
      @set defaults
    else
      @store.set 'defaults', @toJSON()

    _.defer =>
      dfd.resolve this
      @trigger 'sync'

    dfd.promise()

  fetchDropbox: ->
    dfd = $.Deferred()

    ds = @dropboxStore.getDatastoreManager()
    ds.openDefaultDatastore (error, store) =>
      @table = store.getTable('default-settings')
      results = @table.query()
      @result = results[0]

      if @result
        @set @result.getFields()
      else
        @table.insert @toJSON()

      dfd.resolve this
      @trigger 'sync'

    dfd.promise()
