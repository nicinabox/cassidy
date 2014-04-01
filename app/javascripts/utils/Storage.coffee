class App.Storage
  constructor: (@namespace) ->

  set: (key, value) ->
    value = JSON.stringify value unless typeof value == 'string'
    localStorage.setItem([@namespace, key].join('_'), value)
    @get key

  get: (key) ->
    data = localStorage.getItem([@namespace, key].join('_'))
    try
      JSON.parse(data)
    catch e
      data

