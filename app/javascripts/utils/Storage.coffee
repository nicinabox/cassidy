class App.Storage
  constructor: (@namespace) ->

  set: (key, value) ->
    value = JSON.stringify value unless typeof value == 'string'
    localStorage.setItem(@namespacedKey(key), value)
    @get key

  get: (key) ->
    data = localStorage.getItem(@namespacedKey(key))
    try
      JSON.parse(data)
    catch e
      data

  clear: ->
    localStorage.clear()

  namespacedKey: (key) ->
    [@namespace, key].filter((n) -> n).join('_')
