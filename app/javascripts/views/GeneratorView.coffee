class App.GeneratorView extends Backbone.View
  template: JST['generator']
  id: 'generator'
  className: 'col-sm-7 col-md-6 col-md-push-4 col-sm-push-5'

  events:
    'submit form': 'generatePassword'
    'change input[name=service]': 'generatePassword'
    'keyup input[name=service]': 'submitForm'
    'click .clear': 'clearForm'
    'click .result': 'selectResult'
    'focus .result': 'toggleHint'
    'blur .result': 'toggleHint'

  render: ->
    @$el.html @template()
    @typeahead()
    @setSuperKey()
    @el

  typeahead: ->
    @$('input[name=service]').typeahead({
      highlight: true
    }, App.collections.services.toDataset())

  updateTypeahead: ->
    @$('input[name=service]').typeahead('destroy')
    @typeahead()

  submitForm: (e) ->
    @toggleBorderClass()

    if e.which == 13
      @$('input[name=service]').typeahead('close')
      @selectResult()
      @saveService()

    if e.target.value
      $(e.target.form).trigger('submit')
    else
      @clearForm()

  generatePassword: (e) ->
    e.preventDefault() if e
    return unless @$('[name=service]').val().length

    @toggleClearButton()
    data = @serviceData()
    generator = new App.Generator(data)
    @$('.result').val generator.result || generator.error

  saveService: (e) ->
    settings = App.views.settings.model
    data = @serviceData()

    _.each settings.protectedAttributes, (attr) -> delete data.settings[attr]
    model = App.collections.services.where(service: data.service)[0]

    if model
      model.save(data)
    else
      model = App.collections.services.create data

      # Rollback
      unless model.isValid()
        model.destroy()

    @updateTypeahead()

  selectResult: (e) ->
    @$('.result').select()

  setSuperKey: ->
    if /Win/.test(navigator.appVersion)
      @$('.super-key').text('Ctrl+')

  clearForm: (e) ->
    e.preventDefault() if e
    @$('form')[0].reset()
    @toggleClearButton()
    App.views.settings.resetSettings()
    @$('[name=service]').focus()

  toggleBorderClass: ->
    @$('[name=service]').toggleClass 'no-border-radius',
      @$('.tt-dropdown-menu').is(':visible')

  toggleClearButton: ->
    @$('.clear').toggle !!@$('[name=service]').val().length

  toggleHint: ->
    @$('.hint').toggleClass('visible')

  populated: ->
    !!@$('[name=service]').val().length

  serviceData: ->
    settingsView = App.views.settings
    form_data = @$('form').serializeObject()

    # Merge phrase with settings
    settings  = _.merge settingsView.model.attributes,
      settingsView.phraseView.model.attributes

    # Merge form data with settings
    _.merge form_data, settings: settings
