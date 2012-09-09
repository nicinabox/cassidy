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
    App.is_mobile = (navigator.userAgent.match(/mobile/i) != null ? true : false)

    $('body').on 'swipe.animated', '#swipe', (e) ->
      pos = Swipe.getPos()
      if pos != self.active_panel
        self.active_panel = pos
        self.focus_input()

    $('#secret').bind('focus touchstart', ->

      @selectionStart = 0;
      @selectionEnd = @value.length;

      if self.is_mobile
        $('small.hint').fadeIn()
    ).blur(->
      if self.is_mobile
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

    hatchpass = new App.Secret
      master: $('#master').val()
      domain: $('#domain').val()
      config: config

    if hatchpass
      $('#secret').val(hatchpass.get('secret'))
      if App.is_mobile
        if $('#secret').val().length > 0
          $('#secret').show().attr('readonly', false)
        else
          $('#secret').hide().attr('readonly', true)

      $('#secret').off().one 'focus', (e) ->
        App.Domains.save(
          url: $('#domain').val()
        )
)

App.AppView = new AppView