class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form': 'updateSettings'
    'click .reset-settings': 'resetSettings'
    'click .clear-data': 'clearData'

  initialize: ->
    _.bindAll this, 'render'

    @model = new App.SettingsModel
    @phraseView = new App.PhraseView
    @phraseView.model.settings = @model

    @listenTo @model, 'change', @render
    @listenTo @phraseView.model, 'change', @render

    @listenTo @model, 'change:key', (model, prop) ->
      @model.saveKey()

    @model.fetch()
      .then(=> @phraseView.model.fetch())
      .then =>
        if _.isEmpty @phraseView.model.get('phrase')
          App.router.redirectTo 'welcome'
        else
          @render()

  render: ->
    @$('[title]').tooltip('destroy')

    @$el.html @template _.extend @model.toJSON(),
      dropbox_auth: Backbone.DropboxDatastore.client.isAuthenticated()

    @$('.placeholder-passphrase').replaceWith @phraseView.render()
    @phraseView.delegateEvents()

    @$('[title]').tooltip
      placement: 'right'
      container: 'body'

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
    @model.resetOptions()
    @updateService()

  clearData: (e) ->
    e.preventDefault()
    if confirm 'Are you sure you want to clear all saved data?'
      if Backbone.DropboxDatastore.client.isAuthenticated()
        client = Backbone.DropboxDatastore.client
        ds = client.getDatastoreManager()
        ds.deleteDatastore 'default', ->
          window.location.reload()
      else
        localStorage.clear()
        window.location.reload()

  populate: (model) ->
    settings = model.get('settings')
    if typeof settings == 'string'
      @model.set JSON.parse settings
    else
      @model.set settings
