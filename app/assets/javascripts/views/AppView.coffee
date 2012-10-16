AppView = Backbone.View.extend(
  active_panel: 1
  el: $('#new_secret form')
  events:
    'change #master': 'toggle_master'
    'keyup input.required': 'render'

  initialize: ->
    self = this
    $panel = $('#swipe .panel')

    window.Swipe = new Swipe(
      $('#swipe')[0]
      startSlide: self.active_panel
      callback: (x, d) ->
        $('#swipe').trigger('swipe.animated')
    )

    App.ConfigView.model.bind('change', this.render, this);

    @load_master()
    @focus_input()
    App.is_mobile = (/mobile/i).test(navigator.userAgent)

    $('body').on 'swipe.animated', '#swipe', (e) ->
      pos = Swipe.getPos()
      if pos != self.active_panel
        self.active_panel = pos
        self.focus_input()

    $('#secret').on('focus touchstart', ->
      @selectionStart = 0;
      @selectionEnd = @value.length;

      App.Domains.save(
        url: $('#domain').val()
        config: App.ConfigView.model.toJSON()
      )

      if App.is_mobile
        $('small.hint').fadeIn()
    ).on('blur', ->
      if App.is_mobile
        $('small.hint').fadeOut()
    )

  load_master: ->
    $('#master').val(App.ConfigView.model.get('master'))

  focus_input: ->
    $('input.required:visible', @el).each (i) ->
      if !@value.length
        $(this).focus()
        false

  toggle_master: ->
    if App.ConfigView.model.get('save_all')
      App.ConfigView.saveConfig()

  render: ->
    config = App.ConfigView.model.toJSON()

    secret = new App.Secret
      master: $('#master').val()
      domain: $('#domain').val()
      config: config

    if secret
      $('#secret').val(secret.get('secret'))
      if App.is_mobile
        if $('#secret').val().length
          $('#secret').show().attr('readonly', false)
        else
          $('#secret').hide().attr('readonly', true)
)

App.AppView = new AppView