$ ->
  showHelp = localStorage.help
  unless showHelp == "false"
    $('.help').show()

  $(document).on 'click', '.close', (e) ->
    e.preventDefault()
    $(this).parent('.help').hide()
    localStorage.help = false