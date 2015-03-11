class App.Shortcuts extends Backbone.Shortcuts
  shortcuts:
    'esc': 'resetGenerator'
    'h': 'toggleHelp'
    'shift+/': 'toggleHelp'
    '/': 'focusGenerator'
    'f': 'focusGenerator'
    'a': 'selectServicesTab'
    'e': 'selectSettingsTab'
    'l settings': 'selectLength'
    'k settings': 'selectKey'
    'p settings': 'selectPhrase'

  initialize: ->
    @overrideKeyFilter()
    @generator = App.views.generator
    @sidebar   = App.views.sidebar
    @settings  = App.views.settings
    @phrase    = App.views.settings.phraseView
    @tabs      = App.views.sidebar_tabs

  toggleHelp: ->
    App.views.shortcuts.toggle()

  resetGenerator: ->
    @generator.clearForm()
    $('input').blur()
    $('.modal').modal('hide')

  focusGenerator: ->
    @generator.focus()
    false

  selectLength: ->
    @settings.$('[name="length"]').select()
    false

  selectKey: ->
    @settings.$('[name="key"]').select()
    false

  selectPhrase: ->
    @phrase.$('input').select()
    false

  selectServicesTab: ->
    @tabs.$('li:first a').tab('show')
    key.setScope('services')

  selectSettingsTab: ->
    @tabs.$('li:last a').tab('show')
    key.setScope('settings')

  overrideKeyFilter: ->
    key.filter = (e) ->
      tagName = (event.target || event.srcElement).tagName
      isInput = /^(INPUT|TEXTAREA|SELECT)$/.test(tagName)

      if isInput && e.which != 27
        false
      else
        true
