class App.SettingsModel extends Backbone.Model

  # Fallback on localStorage
  setStorage: ->
    if Backbone.DropboxDatastore.client.isAuthenticated()
      @dropboxStore = Backbone.DropboxDatastore.client
    else
      @store = new App.Storage('settings')

  defaults: ->
    length: 20
    upper: 1
    lower: 1
    number: 1
    symbol: 1
    dash: 1
    space: 0
    key: @newKey()

  inverseDefaults: ->
    space: 0
    upper: 0
    lower: 0
    number: 0
    symbol: 0
    dash: 0

  protectedAttributes: ['key', 'phrase']

  initialize: ->
    @setStorage()
    @setInitialDefaults()

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
    time = new Date().getTime().toString()
    CryptoJS.PBKDF2(time, '', { keySize: 128/32 })
      .toString().substr(0, 5)

  resetDefaults: ->
    @set @defaults()
    @saveKey()
    @trigger('sync')

  setInitialDefaults: ->
    if @store
      defaults = @store.get('defaults')
      if defaults
        @set defaults
      else
        @store.set 'defaults', @toJSON()

    if @dropboxStore
      ds = @dropboxStore.getDatastoreManager()
      ds.openDefaultDatastore (error, store) =>
        @table = store.getTable('default-settings')
        results = @table.query()
        @result = results[0]

        if @result
          @set @result.getFields()
          @trigger 'sync'
        else
          @table.insert @toJSON()
