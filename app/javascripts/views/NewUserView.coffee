class App.NewUserView extends Backbone.View
  id: 'new-user'
  template: JST['new_user']

  events:
    'submit form': 'savePhrase'
    'click .skip': 'skipOnboarding'

  render: ->
    @$el.html @template()
    @el

  savePhrase: (e) ->
    e.preventDefault()
    model = App.views.settings.phraseView.model
    data  = $(e.currentTarget).serializeObject()

    if data.phrase
      model.set('phrase', data.phrase)
      @$el.fadeOut()

  skipOnboarding: (e) ->
    e.preventDefault()
    @$el.fadeOut()

