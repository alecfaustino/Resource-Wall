$(document).ready(function () {

  console.log('Page is loaded');
  $('.search-input').on('keypress', function (e) {
    // send get request on enter
    if (e.key === 'Enter') {
      const query = $(this).val().trim();

      $.ajax({
        url: '/api/index',
        method: 'GET',
        cache: false,
        data: { search: query },
        success: function (html) {
          const $grid = $('.masonry-grid');
          $grid.empty();

          if (!html.trim()) {
            $grid.append('<p class="text-center">No results found</p>');
            return;
          }

          $grid.append(html); // add rendered cards
        },
        error: function (err) {
          console.error('Search error:', err);
        }
      });
    }
  });
});
