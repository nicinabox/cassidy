Handlebars.registerHelper 'checked', (attr) ->
  'checked' if attr

Handlebars.registerHelper 'settingsIcon', (attr) ->
  if attr
    'fa-toggle-on'
  else
    'fa-toggle-off'

Handlebars.registerHelper 'toggle', (name, obj) ->
  template = JST['toggle']
  value    = obj[name]

  attrs =
    label: obj.toggle[name].label
    name: name
    value: value
    toggleClass: (if value then 'fa-toggle-on' else 'fa-toggle-off')
    attr:
      checked: (if value then 'checked' else '')

  new Handlebars.SafeString template(attrs)
