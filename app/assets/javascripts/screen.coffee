$ ->
  total_panels = $('.swipe-container').children().length
  $('.panel-nav a').click (e) ->
    e.preventDefault()
    direction = $(this).data('direction')
      
    if direction == 'next'
      Swipe.next()
    else
      Swipe.prev()
    
  $('body').on 'swipe.animated', ->
    $nav = $('.panel-nav')
    $panel = $('#swipe .panel')
    position = Swipe.getPos()
    $active = $panel.eq(position)
    total = $panel.length    
    next = (if position <= total then position+1 else position)
    prev = (if position > 0 then position-1 else 0)

    $nav.fadeIn('fast') unless is_mobile
        
    $next = $('.next', $nav)
    $prev = $('.prev', $nav)
    if position == (total_panels-1)
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
      
  $('body').on 'click', '#recent_domains a.domain', (e) ->
    e.preventDefault()
    $('#domain').val($.trim($(this).text()))
    AppView.render()
    Swipe.next()
    
  $('body').on 'click', '#recent_domains a.remove', (e) ->
    e.preventDefault()
    e.stopPropagation() if e.type == 'swipe'
    id = $(this).data('id')
    
    recent_domains = JSON.parse(localStorage.recent_domains)
    recent_domains.splice(id, 1)
    localStorage.recent_domains = JSON.stringify(recent_domains)
    AppView.render_domains()