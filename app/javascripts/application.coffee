window.Settings = Backbone.Model.extend(    
  defaults:
    key: ''
    length: 10
    caps: true
    symbols: true
    save_settings: true
    save_master: false
    save_key: true

  initialize: ->
    @set(key: @newKey())

  newKey: ->
    Crypto.SHA256(new Date().getTime().toString()).substr(0, 5)
)

window.SettingsCollection = Backbone.Collection.extend(
  localStorage: new Store("settings")
  model: Settings
)


SettingsView = Backbone.View.extend(
  model: Settings
  el: $('#settings')
  events:
    'change input': 'saveSettings'
    'click .toggle-settings': 'togglePane'

  initialize: ->
    @settings = new Settings()
    # @load()
  
  load: ->
    if localStorage.settings
      @settings.set(JSON.parse(localStorage.settings))

    settings = @settings.toJSON()    
    for own index, value of settings
      switch $("##{index}").attr('type')
        when "checkbox"
          $("##{index}").attr('checked', settings[index])
          break
        else
          $("##{index}").val(settings[index])
          break
    
  togglePane: (e) ->
    e.preventDefault()
    $('form', @el).slideToggle('fast')
  
  saveSettings: ->
    @settings = $('form', @el).serializeObject()
    unless @settings.save_key
      delete @settings.key
      
    if @settings.save_settings
      localStorage.settings = JSON.stringify(@settings)
    
    if @settings.save_master
      @saveMaster()
      
  saveMaster: ->
    master = $('#master').val()
    if settings.save_master
      if master.length > 0
        localStorage.master = master
    else
      if localStorage.master
        localStorage.removeItem('master')
)

window.Secret = Backbone.Model.extend(
  defaults:
    master: ''
    domain: ''
    
  initialize: ->
    @bind('error', (model, errors) ->
      # console.log errors
    )
    error = @validate(@attributes);
    unless error
      @create()
    
  validate: (attrs) ->
    for own index, value of attrs
      if attrs[index].length == 0
        return [index, "can't be blank"]
  
  create: ->
    settings = @attributes.settings
    symbols = "!@#]^&*(%[?${+=})_-|/<>".split('')
    domain = @attributes.domain.toLowerCase()
    [host, tld] = domain.split(".")
    tld = 'com' unless tld
    
    hash = Crypto.SHA256("#{@attributes.master}:#{host}.#{tld}")
    hash = Crypto.SHA256("#{hash}#{settings.key}").substr(0, settings.length)
    
    nums = 0
    key_num = hash.match(/\d/)[0]
    secret = hash.split(//)
    this_upper = true

    for item in secret
      if item.match(/[a-zA-Z]/) # Letters
        if settings.caps == true && !this_upper
          this_upper = true
          secret[_i] = item.match(/[a-zA-Z]/)[0].toUpperCase()
        else
          this_upper = false
      else # Numbers
        if settings.symbols == true
          secret_idx = parseInt(_i + key_num / 3)
          sym_idx = nums + _i + (key_num * nums) + (1 * _i)
          unless  (secret[secret_idx] == null) or 
                  (secret_idx < 0) or 
                  (sym_idx < 0) or 
                  (symbols[sym_idx] == null) or
                  (symbols[sym_idx] == undefined)
            secret[secret_idx] += symbols[sym_idx]
        nums += 1
    
    secret = secret.join('').substr(0, settings.length)
    @set(secret: secret)
)

HatchpassView = Backbone.View.extend(
  el: $('#new_secret form')
  events:
    'keyup input.required': 'newSecret'
  
  initialize: ->
    @focus()
    $('#secret:focus').select()
    
  focus: ->
    $('input.required:visible', @el).each((index) ->
      if @value.length == 0
        $(this).focus()
        false
    ) 
    
  newSecret: ->
    settings = $('#settings form').serializeObject()
    hatchpass = new Secret(
        master: $('#master').val()
        domain: $('#domain').val()
        settings: settings
      )
    if hatchpass
      $('#secret').val(hatchpass.get('secret'))
)

window.MySettings = new SettingsCollection
window.HatchpassView = new HatchpassView
window.SettingsView = new SettingsView
# Backbone.history.start(
#   pushState: true
#   root: '/test'
# )