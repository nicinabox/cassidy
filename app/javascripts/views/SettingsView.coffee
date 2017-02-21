class App.SettingsView extends Backbone.View
  template: JST['settings']
  id: 'settings'
  className: 'tab-pane'

  events:
    'change form#settingsForm': 'updateSettings'
    'click .reset-settings': 'resetSettings'
    'click .export-csv': 'handleCSVExport'
    'click .clear-data': 'clearData'
    'click .length-presets a': 'setLength'

  initialize: ->
    _.bindAll this, 'render'

    @model = App.models.settings
    @phraseView = new App.PhraseView

    @listenTo @model, 'change', @render

    @listenTo @model, 'change:key', (model, prop) ->
      @model.saveKey()

    @model.fetch()
      .then(=> App.models.phrase.fetch())
      .then =>
        hasPhrase      = !_.isEmpty(App.models.phrase.get('phrase'))
        hasPhrase      ||= App.models.phrase.get('defaultPhrase')
        requiresPhrase = App.models.phrase.get('require_always')

        if requiresPhrase
          App.models.phrase.unset 'phrase'
          App.prompt('Please enter your phrase:').then (answer) ->
            App.models.phrase.set phrase: answer
          @render()
        else
          if hasPhrase
            @render()
          else
            App.router.redirectTo 'welcome'

  render: ->
    @$('[title]').tooltip('destroy')

    @$el.html @template _.extend @model.toJSON(),
      toggles:
        lower: 'Lowercase'
        upper: 'Uppercase'
        number: 'Numbers'
        dash: 'Dashes & underscore'
        symbol: 'Symbols'

    @$('.placeholder-passphrase').replaceWith @phraseView.render()
    @phraseView.delegateEvents()

    @$('[title]').tooltip
      placement: 'right'
      container: 'body'

    @el

  updateSettings: (e) ->
    data = Backbone.Syphon.serialize(this)
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

  setLength: (e) ->
    e.preventDefault()
    @$('#length')
      .val($(e.currentTarget).text())
      .trigger('change')

  handleCSVExport: (e) ->
    e.preventDefault()
    @downloadCSV()

  sanitizeValue: (str) ->
    "\"#{str.replace(/"/g, '""')}\""

  downloadCSV: ->
    data = localStorage
    ids = data['services'].split(',')

    key = @model.get('key')
    rows = ids.map((id) =>
      service = JSON.parse(data['services-' + id])
      service.settings = JSON.parse(service.settings)
      service.settings.key = key
      _.merge(service.settings, App.models.phrase.toJSON())

      generator = new App.Generator(service)

      [
        service.service,
        '',
        '',
        @sanitizeValue(generator.result)
      ].join(',')
    ).join('\n')

    el = document.createElement('a')
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(rows))
    el.setAttribute('download', 'cassidy.csv')
    el.click()
