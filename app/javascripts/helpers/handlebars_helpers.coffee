Handlebars.registerHelper 'checked', (attr) ->
  'checked' if attr

Handlebars.registerHelper 'settingsIcon', (attr) ->
  if attr
    'fa-toggle-on'
  else
    'fa-toggle-off'
