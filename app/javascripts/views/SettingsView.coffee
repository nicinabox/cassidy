class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form': 'updateSettings'
    'click .reset-settings': 'resetSettings'
    'click .clear-data': 'clearData'
    'click .connect-dropbox': 'connectDropbox'
    'click .disconnect-dropbox': 'disconnectDropbox'

  initialize: ->
    _.bindAll this, 'render'

    @model = new App.SettingsModel
    @listenTo @model, 'sync', @render
    @listenTo @model, 'change:key', (model, prop) ->
      @model.saveKey()

    @phraseView = new App.PhraseView

  render: ->
    @$el.html @template _.extend _.clone(@model.attributes),
      dropbox_auth: Backbone.DropboxDatastore.client.isAuthenticated()

    @$('.placeholder-passphrase').replaceWith @phraseView.render()
    @phraseView.delegateEvents()
    @el

  updateSettings: (e) ->
    data = $(e.currentTarget).serializeObject()
    defaults = @model.defaults()

    # Fix checkbox data
    _.forEach data, (v, k) -> data[k] = defaults[k] if v == 'on'
    data = _.merge @model.inverseDefaults(), data

    @model.clear silent: true
    @model.set data
    @updateService()

  updateService: ->
    generator = App.views.generator

    if generator.populated?()
      generator.saveService()
      generator.generatePassword()

  resetSettings: (e) ->
    e.preventDefault() if e
    @model.clear silent: true
    @model.setDefaults()
    @updateService()

  clearData: (e) ->
    e.preventDefault()
    if confirm 'Are you sure you want to clear all saved data?'
      localStorage.clear()
      window.location.reload()

  disconnectDropbox: (e) ->
    e.preventDefault()
    Backbone.DropboxDatastore.client.signOut({}, @render)

  connectDropbox: (e) ->
    e.preventDefault()
    Backbone.DropboxDatastore.client.authenticate()
