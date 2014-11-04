class App.PhraseView extends Backbone.View
  template: JST['phrase']
  events:
    'change input': 'save'
    'click .toggle-visibility': 'toggleInputType'

  initialize: ->
    @model = App.models.phrase

  render: ->
    @$el.html @template @model.toPlainTextJSON()
    @el

  save: (e) ->
    return if e.type == 'keyup' and e.which != 13

    val = e.target.value
    @model.set phrase: val
    @model.unset 'defaultPhrase'
    App.views.settings.updateService()

  toggleInputType: (e) ->
    e.preventDefault()

    $target = $(e.target)
    @$('input').attr 'type', (i, attr) ->
      if attr == 'password'
        $target.text('Hide')
        'text'
      else
        $target.text('Show')
        'password'
