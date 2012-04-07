(function() {

  $(function() {
    var total_panels;
    total_panels = $('.panel-container').children().length;
    return $('.panel-nav a').click(function(e) {
      var direction;
      e.preventDefault();
      direction = $(this).data('direction');
      if (direction === 'next') {
        return Swipe.next();
      } else {
        return Swipe.prev();
      }
    });
  });

}).call(this);
