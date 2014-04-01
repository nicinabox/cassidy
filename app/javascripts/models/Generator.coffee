class App.Generator
  constructor: (data) ->
    try
      @result = new Vault(data.settings).generate(data.service)
    catch e
      @error = e

