class App.WelcomeView extends Backbone.View
  id: 'welcome'
  template: JST['welcome']

  events:
    'submit form': 'savePhrase'
    'click .skip': 'skipOnboarding'

  initialize: ->
    @model = App.views.settings.phraseView.model

    @listenTo @model, 'change', ->
      App.router.redirectTo ''

  render: ->
    @$el.html @template()
    @el

  savePhrase: (e) ->
    e.preventDefault()
    data  = $(e.currentTarget).serializeObject()

    if data.phrase
      @model.set('phrase', data.phrase)

  skipOnboarding: (e) ->
    e.preventDefault()
    @model.set
      defaultPhrase: true
      phrase: @model.defaultPhrase
