class window.ConfigView extends Backbone.View
  el: $('#settings')
  tagName: "input"
  events:
    'change input': 'saveConfig'

  initialize: ->
    @model.on('all', @render, this)
    @model.fetch()
    # @import()

  import: ->
    if localStorage.hp_settings
      import_key = localStorage.hp_key
      import_settings = JSON.parse(localStorage.hp_settings)
      import_master = localStorage.hp_master

      import_settings.save_settings = import_settings.remember
      delete import_settings.remember
      delete import_settings.algorithm

      @model.set(
        master: import_master
        key: import_key
      )
      @model.set(import_settings)
      @model.save()

      localStorage.removeItem('hp_key')
      localStorage.removeItem('hp_settings')
      localStorage.removeItem('hp_master')
      console.log "Import successful"
      @render()

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

  saveConfig: ->
    config = $('form', @el).serializeObject()

    master = $('#master').val()
    if master.length > 0
      config.master = $('#master').val()

    @model.set config

    if config.save_all
      @model.save config
    else
      @model.destroy()