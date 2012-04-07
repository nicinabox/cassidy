$ ->
  total_panels = $('.panel-container').children().length
  $('.panel-nav a').click (e) ->
    e.preventDefault()
    direction = $(this).data('direction')
    # target = $(this).attr('href')
    # position = Swipe.getPos()
    # 
    # if position == total_panels || position == 0
    #   $(this).addClass('hide')
      
    if direction == 'next'
      Swipe.next()
    else
      Swipe.prev()
    