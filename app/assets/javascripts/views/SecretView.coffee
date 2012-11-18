class window.SecretView extends Backbone.View
  el: $('#new_secret form')
  events:
    'change #master': 'toggleMaster'
    'keyup input.required': 'render'

  initialize: ->
    app.Config.bind('change', @render, this);

    @loadMaster()

    $('#secret').on 'focus touchstart', ->
      @setSelectionRange 0, @value.length

      app.Domains.save
        url: $('#domain').val()
        config: app.Config.toJSON()

  loadMaster: ->
    $('#master').val app.Config.get 'master'

  focusInput: ->
    $('input.required:visible', this.$el).each ->
      if !@value.length
        $(this).focus()
        false

  toggleMaster: ->
    if app.Config.get('save_all')
      app.ConfigView.saveConfig()

  newSecret: (master, domain, config) ->
    new Secret
      master: master
      domain: domain
      config: config

  render: (model) ->
    if model instanceof Backbone.Model
      config = model.get 'config'
    config ||= app.Config.toJSON()

    secret = @newSecret $('#master').val(),
                        $('#domain').val(),
                        config

    if secret
      $('#secret').val secret.get 'secret'

      if app.mobile
        $('#secret').show().attr('readonly', false)