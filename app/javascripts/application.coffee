window.Settings = Backbone.Model.extend(    
  initialize: ->
    @defaults.key = @newKey()
    
  defaults:
    key: ""
    length: 10
    caps: true
    symbols: true
    save_master: false
    save_key: false
    save_settings: false
    
  newKey: ->
    Crypto.SHA1(new Date().getTime().toString()).substr(0, 5)

)

SettingsList = Backbone.Collection.extend(
  model: Settings
)

window.SettingsView = Backbone.View.extend(
  el: $('#settings')
  localStorage: new Store("settings")
  events: {
    'change input': 'saveSettings'
    'click .toggle-settings': 'togglePane'
  }
  initialize: ->
    @settings = new Settings
    @load()
  
  load: ->
    settings = @settings.defaults
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
    localStorage.settings = JSON.stringify(@settings) if settings.defaults.save_settings
    @saveMaster()
      
  saveMaster: ->
    master = $('#master').val()
    if @settings.save_master
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
    @settings = settings.defaults
    error = @validate(@attributes);
    unless error
      @create(@attributes)
    
  validate: (attrs) ->
    for own index, value of attrs
      if attrs[index].length == 0
        return [index, "can't be blank"]
  
  create: ->
    @set(
      secret: Crypto.SHA1("#{@attributes.master}:#{@attributes.domain}").substr(0, @settings.length)
    )
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