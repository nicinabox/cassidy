class App.PhraseView extends Backbone.View
  template: JST['phrase']
  events:
    'change form#phraseForm': 'updateSettings'
    'submit form#phraseForm': 'updateSettings'
    'click .toggle-visibility': 'toggleInputType'

  initialize: ->
    @model = App.models.phrase

  render: ->
    @$el.html @template _.extend @model.toPlainTextJSON(),
      toggles:
        require_always: 'Require always'
    @el

  updateSettings: (e) ->
    e.preventDefault()
    data = $(e.currentTarget).serializeObject()
    data = _.merge {}, @model.defaults(), data

    @model.set data
    @model.unset 'defaultPhrase' if data.phrase
    App.views.settings.updateService()

  save: (e) ->
    return if e.type == 'keyup' and e.which != 13

    val = e.target.value
    @model.set phrase: val
    @model.unset 'defaultPhrase'
    App.views.settings.updateService()

  toggleInputType: (e) ->
    e.preventDefault()

    $target = $(e.target)
    @$('#phrase').attr 'type', (i, attr) ->
      if attr == 'password'
        $target.text('Hide')
        'text'
      else
        $target.text('Show')
        'password'
