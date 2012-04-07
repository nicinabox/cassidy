(function() {

  $(function() {
    var total_panels;
    total_panels = $('.swipe-container').children().length;
    $('.panel-nav a').click(function(e) {
      var direction;
      e.preventDefault();
      direction = $(this).data('direction');
      if (direction === 'next') {
        return Swipe.next();
      } else {
        return Swipe.prev();
      }
    });
    return $('body').on('swipe.animated', function() {
      var $nav, position;
      $nav = $('.panel-nav');
      position = Swipe.getPos();
      if (!is_mobile) $nav.fadeIn('fast');
      if (position === (total_panels - 1)) {
        $('.next', $nav).hide();
        $('.prev', $nav).show();
      }
      if (position === 0) {
        $('.next', $nav).show();
        return $('.prev', $nav).hide();
      }
    });
  });

}).call(this);
