class window.AppView extends Backbone.View
  el: $('#new_secret form')
  events:
    'change #master': 'toggle_master'
    'keyup input.required': 'render'

  initialize: ->
    $panel = $('#swipe .panel')

    # app.ConfigView.model.bind('change', @render, this);

    # @load_master()
    # @focus_input()
    app.is_mobile = (/mobile/i).test(navigator.userAgent)

    $('#secret').on('focus touchstart', ->
      @selectionStart = 0;
      @selectionEnd = @value.length;

      app.Domains.save
        url: $('#domain').val()
        config: app.ConfigView.model.toJSON()

      if app.is_mobile
        $('small.hint').fadeIn()
    ).on('blur', ->
      if app.is_mobile
        $('small.hint').fadeOut()
    )

  load_master: ->
    # $('#master').val(app.ConfigView.model.get('master'))

  focus_input: ->
    $('input.required:visible', @el).each (i) ->
      if !@value.length
        $(this).focus()
        false

  toggle_master: ->
    if app.ConfigView.model.get('save_all')
      app.ConfigView.saveConfig()

  new_secret: (master, domain, config) ->
    new app.Secret
      master: master
      domain: domain
      config: config

  render: (domain_id) ->
    if typeof domain_id == 'string'
      domain = app.Domains.get domain_id
      config = domain.get('config') || app.ConfigView.model.toJSON()

      $('#domain').val domain.get('url')

      secret = @new_secret  config.master,
                            domain.get('url'),
                            config

    else
      config = app.ConfigView.model.toJSON()
      secret = @new_secret  $('#master').val(),
                            $('#domain').val(),
                            config

    if secret
      $('#secret').val(secret.get('secret'))
      if app.is_mobile
        if $('#secret').val().length
          $('#secret').show().attr('readonly', false)
        else
          $('#secret').hide().attr('readonly', true)