window.Settings = Backbone.Model.extend(    
  defaults:
    key: ""
    length: 10
    caps: true
    symbols: true
    save_master: false
    save_key: false
    save_settings: false

  initialize: ->
    @defaults.key = @newKey()  

  newKey: ->
    "fbb43"
    # Crypto.SHA256(new Date().getTime().toString()).substr(0, 5)

)

window.SettingsView = Backbone.View.extend(
  el: $('#settings')
  localStorage: new Store("settings")
  events: {
    'change input': 'saveSettings'
    'click .toggle-settings': 'togglePane'
  }
  initialize: ->
    window.settings = new Settings().defaults
    @load()
  
  load: ->
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
    $('form', @el).toggle()
  
  saveSettings: ->
    @settings = @el.serializeObject()
    localStorage.settings = JSON.stringify(settings) if settings.save_settings
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
    hatchpass = new Secret(
        master: $('#master').val()
        domain: $('#domain').val()
      )
    if hatchpass
      $('#secret').val(hatchpass.get('secret'))
)

window.HatchpassView = new HatchpassView
new SettingsView
# Backbone.history.start(
#   pushState: true
#   root: '/test'
# )