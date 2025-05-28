$(document).ready(() => {
  // highlight stars up to the one hovered
  $(".rating i")
    .on("mouseenter", function () {
      const index = $(this).data("index");
      const $container = $(this).closest(".rating");

      // loop over stars
      $container.find("i").each(function () {
        const starIndex = $(this).data("index");
        if (starIndex <= index) {
          // For stars before or equal to hovered one -> add yellow color and make them solid
          $(this)
            .addClass("hovered fa-solid")
            .removeClass("fa-regular");
        } else {
          $(this)
          // For stars after the hovered one -> remove yellow color and return to regular
            .removeClass("hovered fa-solid")
            .addClass("fa-regular");
        }
      });
    })
    // logic when mouse away from the stars
    .on("mouseleave", function () {
      const $container = $(this).closest(".rating");

      $container.find("i").each(function () {
        $(this).removeClass("hovered");

        if ($(this).hasClass("selected")) {
          // If star is selected (user-rated), keep it yellow and solid
          $(this).addClass("fa-solid").removeClass("fa-regular");
        } else {
           // If not selected -> makes it regular again
          $(this).addClass("fa-regular").removeClass("fa-solid");
        }
      });
    });

  // CLICK: Save rating and apply selected state
  $(".rating i").on("click", function () {
    const index = $(this).data("index");
    const $container = $(this).closest(".rating");
    const resourceId = $container.data("resource-id");

    $.ajax({
      url: `/api/ratings/${resourceId}`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ rating: index }),
      success: () => {
        $container.find("i").each(function () {
          const starIndex = $(this).data("index");
          $(this)
            .removeClass("fa-solid fa-regular selected")
            .addClass(starIndex <= index ? "fa-solid selected" : "fa-regular");
        });
      },
      error: () => console.error("Rating failed")
    });
  });
});
