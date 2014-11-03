class App.Generator
  constructor: (data) ->
    try
      @result = new App.Vault(data.settings)
                  .generate_with_key(data.service, data.settings.key)
    catch e
      @error = e.message

