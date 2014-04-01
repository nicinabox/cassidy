class App.PhraseView extends Backbone.View
  template: JST['phrase']
  events:
    'change input': 'save'
    'click .toggle-visibility': 'toggleInputType'

  initialize: ->
    @model = new App.PhraseModel

  render: ->
    @$el.html @template @model.attributes
    @el

  save: (e) ->
    return if e.type == 'keyup' and e.which != 13

    val = e.target.value
    @model.set('phrase', val)
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
