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
    $('body').on('swipe.animated', function() {
      var $nav, position;
      $nav = $('.panel-nav');
      position = Swipe.getPos();
      if (!is_mobile) $nav.fadeIn('fast');
      if (position === (total_panels - 1)) {
        $('.next', $nav).hide();
        return $('.prev', $nav).show();
      } else if (position === 0) {
        $('.next', $nav).show();
        return $('.prev', $nav).hide();
      } else {
        $('.next', $nav).show();
        return $('.prev', $nav).show();
      }
    });
    $('body').on('click', '#recent_domains a.domain', function(e) {
      e.preventDefault();
      $('#domain').val($(this).text());
      AppView.render();
      return Swipe.next();
    });
    return $('body').on('click', '#recent_domains a.remove', function(e) {
      var id, recent_domains;
      e.preventDefault();
      if (e.type === 'swipe') e.stopPropagation();
      id = $(this).data('id');
      recent_domains = JSON.parse(localStorage.recent_domains);
      recent_domains.splice(id, 1);
      localStorage.recent_domains = JSON.stringify(recent_domains);
      return AppView.render_domains();
    });
  });

}).call(this);
