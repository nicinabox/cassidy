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
      var $active, $nav, $next, $panel, $prev, next, position, prev, total;
      $nav = $('.panel-nav');
      $panel = $('#swipe .panel');
      position = Swipe.getPos();
      $active = $panel.eq(position);
      total = $panel.length;
      next = (position <= total ? position + 1 : position);
      prev = (position > 0 ? position - 1 : 0);
      if (!is_mobile) $nav.fadeIn('fast');
      $next = $('.next', $nav);
      $prev = $('.prev', $nav);
      if (position === (total_panels - 1)) {
        $next.hide();
        $prev.show();
        return $('span', $prev).text($panel.eq(prev).data('title'));
      } else if (position === 0) {
        $next.show();
        $prev.hide();
        return $('span', $next).text($panel.eq(next).data('title'));
      } else {
        $next.show();
        $prev.show();
        $('span', $prev).text($panel.eq(prev).data('title'));
        return $('span', $next).text($panel.eq(next).data('title'));
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
