App.AppView = Backbone.View.extend(
  el: $('#new_secret form')
  events:
    'change #master': 'toggle_master'
    'keyup input.required': 'render'

  initialize: ->
    self = this
    $panel = $('#swipe .panel')

    window.Swipe = new Swipe(
      document.getElementById('swipe'),
      startSlide: 1
      callback: ->
        $('#swipe').trigger('swipe.animated')
    )

    ConfigView.model.bind('change', this.render, this);

    @load_master()
    @focus()
    @render_domains()
    window.is_mobile = (navigator.userAgent.match(/mobile/i) != null ? true : false)

    $('body').on 'swipe.animated', '#swipe', ->
      $active = $panel.eq(Swipe.getPos())
      if $active[0] == self.el.parent()[0]
        self.focus()

    $('#secret').bind('focus touchstart', ->

      @selectionStart = 0;
      @selectionEnd = @value.length;

      if self.mobile_user
        $('small.hint').fadeIn()
    ).blur(->
      if self.mobile_user
        $('small.hint').fadeOut()
    )

  load_master: ->
    $('#master').val(ConfigView.model.get('master'))

  focus: ->
    console.log('FOCUS')
    $('input.required:visible', @el).each((index) ->
      if @value.length == 0
        $(this).focus()
        false
    )

  toggle_master: ->
    if ConfigView.model.get('save_master')
      ConfigView.saveMaster()

  render: ->
    self = this
    config = ConfigView.model.toJSON()

    hatchpass = new Secret
      master: $('#master').val()
      domain: $('#domain').val()
      config: config

    if hatchpass
      $('#secret').val(hatchpass.get('secret'))
      if window.is_mobile
        if $('#secret').val().length > 0
          $('#secret').show().attr('readonly', false)
        else
          $('#secret').hide().attr('readonly', true)

      $('#secret').off('focus').focus (e) ->
        self.save_domain($('#domain').val())

  save_domain: (domain) ->
    recent_domains = []
    if localStorage.recent_domains
      recent_domains = JSON.parse(localStorage.recent_domains)

    total = recent_domains.length
    if total >= 10
      recent_domains.splice(0, 1)

    recent_domains.push(domain)
    localStorage.recent_domains = JSON.stringify(recent_domains.unique())
    @render_domains()

  render_domains: ->
    recent_domains = []
    if localStorage.recent_domains
      recent_domains = JSON.parse(localStorage.recent_domains)

    total = recent_domains.length
    $recent_domains = $('#recent_domains ul')
    $recent_domains.empty()

    if total > 0
      i = 0
      while i < total
        html = "<li> \
                  <a href='##{recent_domains[i]}' class='domain'>
                    #{recent_domains[i]}
                  </a> \
                  <a href='#remove' class='remove' data-id='#{i}'>&times;</a>
                </li>"
        $recent_domains.append(html)
        i++
    else
      html = "<li class='no-results'>You have no recent domains</li>"
      $recent_domains.append(html)
)

App.AppView = new AppView