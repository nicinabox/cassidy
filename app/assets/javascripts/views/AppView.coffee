class window.AppView extends Backbone.View
  el: $('#new_secret form')
  events:
    'change #master': 'toggleMaster'
    'keyup input.required': 'render'

  initialize: ->
    app.Config.bind('change', @render, this);

    @loadMaster()

    $('#secret').on('focus touchstart', ->
      @selectionStart = 0;
      @selectionEnd = @value.length;

      app.Domains.save
        url: $('#domain').val()
        config: app.ConfigView.model.toJSON()

      if app.mobile
        $('small.hint').fadeIn()
    ).on('blur', ->
      if app.mobile
        $('small.hint').fadeOut()
    )

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

  render: (domain_id) ->
    if typeof domain_id == 'string'
      domain = app.Domains.get domain_id
      config = domain.get('config') || app.ConfigView.model.toJSON()

      $('#domain').val domain.get('url')

      secret = @newSecret  config.master,
                            domain.get('url'),
                            config

    else
      config = app.Config.toJSON()
      secret = @newSecret $('#master').val(),
                          $('#domain').val(),
                          config

    if secret
      $('#secret').val(secret.get('secret'))

      if app.mobile
        if $('#secret').val().length
          $('#secret').show().attr('readonly', false)
        else
          $('#secret').hide().attr('readonly', true)