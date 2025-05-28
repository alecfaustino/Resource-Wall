$(document).ready(() => {
  // add a click handler to like button
  $(".like-btn")
    .off("click")
    .on("click", function () {
      const button = $(this);
      const resourceId = button.data("resource-id");
      // if the heart icon is solid, it's liked
      const isLiked = button.find("i").hasClass("fa-solid");

      console.log("clicked", $);

      // will send a DELETE request (unlike) if it is liked, and POST (like) if it is not
      const method = isLiked ? "DELETE" : "POST";

      $.ajax({
        url: `api/likes/${resourceId}`,
        type: method,
        success: () => {
          // switch to a solid heart to show liked
          const icon = button.find("i");
          icon.toggleClass("fa-solid fa-regular");
        },
        error: () => {
          console.error("Failed to like");
        },
      });
    });
});
