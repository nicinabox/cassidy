class App.PhraseView extends Backbone.View
  template: JST['phrase']
  events:
    'click .toggle-visibility': 'toggleInputType'
    'submit form#phraseForm': 'updateSettings'
    'change form#phraseForm': 'updateSettings'

  initialize: ->
    @model = App.models.phrase
    @listenTo @model, 'change', @render

  render: ->
    @$el.html @template _.extend @model.toJSON(),
      toggles:
        require_always: 'Require always'
    @el

  updateSettings: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize(this)

    @model.set data, silent: true
    changed = @model.changedAttributes()
    if @model.get('defaultPhrase') and changed.phrase
      @model.unset 'defaultPhrase', silent: true

    App.views.settings.updateService()

    _.defer =>
      @model.trigger 'change'

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
