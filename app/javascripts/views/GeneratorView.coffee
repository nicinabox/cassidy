class App.GeneratorView extends Backbone.View
  template: JST['generator']
  id: 'generator'
  className: 'col-sm-7 col-md-6 col-md-push-4 col-sm-push-5'

  events:
    'submit form': 'saveService'
    'keyup input[name=service]': 'submitForm'
    'keyup input[name=service]': 'toggleBorderClass'

  initialize: ->

  render: ->
    @$el.html @template()
    @typeahead()
    @el

  typeahead: ->
    @$('input[name=service]').typeahead({
      highlight: true
    }, App.collections.services.toDataset())

  updateTypeahead: ->
    @$('input[name=service]').typeahead('destroy')
    @typeahead()

  submitForm: (e) ->
    if e.which == 13
      @$('input[name=service]').typeahead('close')
      $(e.target.form).trigger('submit')

  saveService: (e) ->
    e.preventDefault() if e

    data = _.merge @$('form').serializeObject(),
              settings: App.views.settings.model.attributes

    model = App.collections.services.where(service: data.service)[0]

    if model
      model.save(data)
    else
      model = App.collections.services.create data

      # Rollback
      unless model.isValid()
        model.destroy()

    @updateTypeahead()

  toggleBorderClass: ->
    @$('[name=service]').toggleClass 'no-border-radius',
      @$('.tt-dropdown-menu').is(':visible')

  populated: ->
    !!@$('[name=service').val()
