class App.DropboxClient
  APP_KEY = 'vxgu5nbh2ci3sfe'

  constructor: ->
    @client = new Dropbox.Client key: APP_KEY
    @client.authenticate
      interactive: false
    , (error) ->
      console.warn "Authentication error: " + error  if error
      return
