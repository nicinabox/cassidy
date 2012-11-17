class window.SwipeView extends Backbone.View
  el: $('.panel-nav')
  active_panel: 1
  events:
    'click a': 'animate'

  initialize: ->
    @swipe = new Swipe(
      $('#swipe')[0]
    ,
      startSlide: @active_panel
      callback: (e, index, el) =>
        @animated(e, index, el)
    )
    @animated()
    app.AppView.focusInput()

  animated: (e, index, el) ->
    $nav = $('.panel-nav')
    $panel = $('#swipe .panel')
    position = @swipe.getPos()
    $active = $panel.eq(position)

    $next = $('.next', $nav)
    $prev = $('.prev', $nav)

    next = (if position <= @swipe.length then position + 1 else position)
    prev = (if position > 0 then position - 1 else 0)

    if navigator.userAgent.match(/ipad/i) || !app.mobile
      $nav.fadeIn('fast')

    if position == (@swipe.length - 1)
      $next.hide()
      $prev.show()
      $('span', $prev).text($panel.eq(prev).data('title'))
    else if position == 0
      $next.show()
      $prev.hide()
      $('span', $next).text($panel.eq(next).data('title'))
    else
      $next.show()
      $prev.show()
      $('span', $prev).text($panel.eq(prev).data('title'))
      $('span', $next).text($panel.eq(next).data('title'))

  animate: (e) ->
    e.preventDefault()
    direction = $(e.target).data('direction')
    if direction == 'next'
      @swipe.next()
    else
      @swipe.prev()