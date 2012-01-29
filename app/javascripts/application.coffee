window.Config = Backbone.Model.extend(
  localStorage: new Store("settings")
  defaults:
    key: ''
    length: 10
    caps: true
    symbols: true
    save_settings: false
    save_master: false
    save_key: true

  initialize: ->
    @set(key: @newKey())

  newKey: ->
    Crypto.SHA256(new Date().getTime().toString()).substr(0, 5)
)

ConfigView = Backbone.View.extend(
  el: $('#settings')
  tagName: "input"
  events:
    'change input': 'saveConfig'
    'click .toggle-settings': 'togglePane'

  initialize: ->
    @model = new Config
    self = this
    @model.fetch(
      success: (model, response)->
        self.model.unset('0')
        self.model.set(response[0])
        self.render()
    )
    
  render: ->
    config = @model.attributes
    for own index, value of config
      switch $("##{index}").attr('type')
        when "checkbox"
          $("##{index}").attr('checked', config[index])
          break
        else
          $("##{index}").val(config[index])
          break
    
  togglePane: (e) ->
    e.preventDefault()
    $('form', @el).slideToggle('fast')
  
  saveConfig: ->
    config = $('form', @el).serializeObject()
    
    # unless config.attributes.save_key
    #   delete config.key
    
    if config.save_settings
      @model.save(
        config
        success: (model, response) ->
          console.log response
      )
    
    if config.save_master
      @saveMaster()
      
  saveMaster: ->
    master = $('#master').val()
    if config.save_master
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
    config = @attributes.config
    symbols = "!@#]^&*(%[?${+=})_-|/<>".split('')
    domain = @attributes.domain.toLowerCase()
    [host, tld] = domain.split(".")
    tld = 'com' unless tld
    
    hash = Crypto.SHA256("#{@attributes.master}:#{host}.#{tld}")
    hash = Crypto.SHA256("#{hash}#{config.key}").substr(0, config.length)
    
    nums = 0
    key_num = hash.match(/\d/)[0]
    secret = hash.split(//)
    this_upper = true

    for item in secret
      if item.match(/[a-zA-Z]/) # Letters
        if config.caps == true && !this_upper
          this_upper = true
          secret[_i] = item.match(/[a-zA-Z]/)[0].toUpperCase()
        else
          this_upper = false
      else # Numbers
        if config.symbols == true
          secret_idx = parseInt(_i + key_num / 3)
          sym_idx = nums + _i + (key_num * nums) + (1 * _i)
          unless  (secret[secret_idx] == null) or 
                  (secret_idx < 0) or 
                  (sym_idx < 0) or 
                  (symbols[sym_idx] == null) or
                  (symbols[sym_idx] == undefined)
            secret[secret_idx] += symbols[sym_idx]
        nums += 1
    
    secret = secret.join('').substr(0, config.length)
    @set(secret: secret)
)

AppView = Backbone.View.extend(
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
    config = $('#settings form').serializeObject()
    hatchpass = new Secret(
        master: $('#master').val()
        domain: $('#domain').val()
        config: config
      )
    if hatchpass
      $('#secret').val(hatchpass.get('secret'))
)

window.ConfigView = new ConfigView
window.AppView = new AppView

# Backbone.history.start(
#   pushState: true
#   root: '/test'
# )