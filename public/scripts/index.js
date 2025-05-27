$(document).ready(function () {

  console.log('Page is loaded');
  $('.search-input').on('keypress', function (e) {
    // send get request on enter
    if (e.key === 'Enter') {
      const query = $(this).val().trim();

      $.ajax({
        url: '/api/resources',
        method: 'GET',
        cache: false,
        data: { search: query },
        success: function (resources) {
          const $grid = $('.masonry-grid');
          $grid.empty();

          if (resources.length === 0) {
            $grid.append('<p class="text-center">No results found</p>');
            return;
          }
          // Build a card for each resource if search succesful
          resources.forEach(resource => {
            const $card = $(`
            <div class="masonry-item">
              <div class="resource-card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${resource.title}</h5>
                  <p class="card-text">${resource.description}</p>
                  ${resource.link_url ? `<p><a href="${resource.link_url}" target="_blank">${resource.link_name}</a></p>` : ''}
                  ${resource.topic ? `<p>Topic: ${resource.topic}</p>` : ''}
                </div>
                <div class="card-footer">
                  <span class="author">Posted by: ${resource.author}</span>
                </div>
              </div>
            </div>
          `);
            $grid.append($card);
          });
        },
        error: function (err) {
          console.error('Search error:', err);
        }
      });
    }
  });
});
