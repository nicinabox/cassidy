class App.PhraseView extends Backbone.View
  template: JST['phrase']
  events:
    'click .toggle-visibility': 'toggleInputType'
    'submit form#phraseForm': 'updateSettings'
    'change form#phraseForm': 'updateSettings'

  initialize: ->
    @model = App.models.phrase

  render: ->
    @$el.html @template _.extend @model.toPlainTextJSON(),
      toggles:
        require_always: 'Require always'
    @el

  updateSettings: (e) ->
    e.preventDefault()

    data = Backbone.Syphon.serialize(this)

    @model.set data
    changed = @model.changedAttributes()
    if @model.get('defaultPhrase') and changed.phrase
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
