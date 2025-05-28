$(document).ready(function () {
  $(".resource-card").on('click', function (e) {
    console.log('card clicked!');
    // don't allow the click when it's with the like button comment button or a link.
    if (
      // traverse the DOM tree and see if there is a match or not.
      // if the button we click itself is the like button, the element would find a match and return 1. If it's not the like button, it would return 0.
      // https://api.jquery.com/closest/
      $(e.target).closest(".rating").length ||
      $(e.target).closest(".like-btn").length ||
      $(e.target).closest(".comment-btn").length ||
      // Checks if the target is an a tag
      $(e.target).is('a')
    ) return;

    // store the data in like button in resource_id
    // this data-resource-id attribute is mounted to the like button in resource_card.ejs
    const resourceId = $(this).find('.like-btn').data('resource-id');

    if (resourceId) {
      //redirect to the full card view
      window.location.href = `/resources/${resourceId}`;
    }

  });
});
