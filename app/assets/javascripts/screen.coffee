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
    position = Swipe.getPos()
    
    $nav.fadeIn('fast') unless is_mobile
        
    if position == (total_panels-1)
      $('.next', $nav).hide()
      $('.prev', $nav).show()
    else if position == 0
      $('.next', $nav).show()
      $('.prev', $nav).hide()
    else
      $('.next', $nav).show()
      $('.prev', $nav).show()
      
  $('body').on 'click', '#recent_domains a.domain', (e) ->
    e.preventDefault()
    
    $('#domain').val($(this).text())
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