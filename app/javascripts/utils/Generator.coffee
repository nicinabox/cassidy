class App.Generator
  constructor: (data) ->
    try
      @result = new App.Vault(@coerceSettingsValues(data.settings))
                  .generate_with_key(data.service, data.settings.key)
    catch e
      @error = e.message

  coerceSettingsValues: (settings) ->
    _.each settings, (v, k) ->
      settings[k] = (if v then 1 else 0) if _.isBoolean(v)
