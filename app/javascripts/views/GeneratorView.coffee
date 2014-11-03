class App.GeneratorView extends Backbone.View
  template: JST['generator']
  id: 'generator'
  className: 'col-sm-7 col-md-6 col-md-push-4 col-sm-push-5'

  events:
    'keyup #service': 'submitForm'
    'change #service': 'generatePassword'

    'click .clear': 'clearForm'
    'click #result': 'selectResult'
    'focus #result': 'selectResult'
    'blur #result': 'toggleHint'
    'keydown #result': 'preventChange'
    'cut #result': 'preventChange'

  initialize: ->
    _.bindAll this, 'toggleHint'

    @suggestionsView = new App.SuggestionsView

    @listenToOnce App.collections.services, 'sync', ->
      @typeahead()

  render: ->
    @$el.html @template()
    @$el.append @suggestionsView.render()

    @$service = @$('#service')
    @removeReadonlyOnMobile()
    @setSuperKey()

    if App.collections.services.length
      @typeahead()
      @stopListening App.collections.services

    @el

  typeahead: ->
    @$service.typeahead
      highlight: true
    , App.collections.services.toDataset()

  submitForm: (e) ->
    @toggleBorderClass()

    # Escape
    if e.which == 27
      return

    if e.target.value
      @populateSettings @findService(e.target.value)
      @generatePassword()
    else
      @clearForm()

    # Enter
    if e.which == 13
      @$service.typeahead('close')
      @selectResult()

  generatePassword: (e) ->
    return unless @populated()

    @toggleClearButton()
    data = @serviceData()
    generator = new App.Generator(data)
    @$('#result').val generator.result || generator.error

  saveService: (e) ->
    settings = App.views.settings.model
    data = @serviceData()

    _.each settings.protectedAttributes, (attr) -> delete data.settings[attr]
    model = @findService(data.service)
    data.settings = JSON.stringify(data.settings)

    if model
      model.setUsage()
      model.save(data)
    else
      data.usage = 1
      model = App.collections.services.create data

      # Rollback
      unless model.isValid()
        model.destroy()

  focus: ->
    @$service.focus()

  selectResult: (e) ->
    setTimeout =>
      @saveService() if @hasChanged()
      $result = @$('#result')
      result = $result[0]
      result.focus()
      result.setSelectionRange(0, result.value.length)
      @toggleHint()
    , 0

  preventChange: (e) ->
    return unless App.isMobile
    e.preventDefault()
    e.stopImmediatePropagation()

  setSuperKey: ->
    superKeys =
      win: 'Ctrl'
      osx: 'Cmd'

    @$('.super-key').text superKeys[App.platform] + '+'

  clearForm: (e) ->
    e.preventDefault() if e

    @$service.typeahead('close')
    @$service.typeahead('val', '')
    @$('form')[0].reset()
    @originalVal = null
    @toggleClearButton()
    @toggleHint()
    App.views.settings.resetSettings()

  toggleBorderClass: ->
    @$service.toggleClass 'no-border-radius',
      @$('.tt-dropdown-menu').is(':visible')

  toggleClearButton: ->
    @$('.clear').toggle !!@$('#service').val().length

  toggleHint: ->
    @$('.hint').toggleClass 'visible', !!@$('#result').val()

  populated: ->
    !!@$service.val().length

  removeReadonlyOnMobile: ->
    return unless App.isMobile
    @$('#result').removeAttr('readonly')

  findService: (name) ->
    model = App.collections.services.where(service: name)[0]

  populateSettings: (settingsModel) ->
    App.views.settings.populate(settingsModel) if settingsModel

  serviceData: ->
    settingsView = App.views.settings
    form_data = @$('form').serializeObject()

    # Merge phrase with settings
    settings  = _.merge settingsView.model.attributes,
      settingsView.phraseView.model.attributes

    # Merge form data with settings
    _.merge form_data, settings: settings

  populate: (model) ->
    service_name = model.get('service')
    @$service
      .typeahead('val', service_name)
      .typeahead('close')
      .val(service_name)
      .trigger('change')
    model.setUsage().save() if @hasChanged()
    @selectResult()

  hasChanged: ->
    val = @$service.val()
    diff = @originalVal != val

    if diff or !@originalVal
      @originalVal = val
      diff
