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
      
    if position == 0
      $('.next', $nav).show()
      $('.prev', $nav).hide()