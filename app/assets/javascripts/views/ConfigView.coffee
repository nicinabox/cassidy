class window.ConfigView extends Backbone.View
  el: $('#settings')
  tagName: "input"
  events:
    'change input': 'saveConfig'

  initialize: ->
    @model.on('change', @render, this)
    @model.fetch(
      success: (model, response) =>
        @model.unset('0')
        @model.set(response[0])
        @model.save() if @model.isNew()
    )

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
    config = @model.toJSON()
    for own key, value of config
      switch $("##{key}").attr('type')
        when "checkbox"
          $("##{key}").attr('checked', config[key])
          break
        else
          $("##{key}").val(config[key])
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