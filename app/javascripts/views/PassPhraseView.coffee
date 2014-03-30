class App.PassPhraseView extends Backbone.View
  template: JST['passphrase']
  events:
    'blur input': 'save'
    'keyup input': 'save'
    'click .toggle-visibility': 'toggleInputType'

  initialize: ->
    @model = new App.PassPhraseModel
    @listenTo @model, 'sync', @renderContent

  render: ->
    @renderContent()
    @model.fetch()
    @el

  renderContent: ->
    @$el.html @template @model.attributes

  save: (e) ->
    return if e.type == 'keyup' and e.which != 13

    val = e.target.value
    @model.save('passphrase', val)

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
