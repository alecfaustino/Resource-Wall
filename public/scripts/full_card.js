$(document).ready(() => {
  // click handler for return to resources
  $("#return-btn").on("click", () => {
    console.log("return-btn clicked");
    window.location.href = "/";
  });

  $("#delete-btn").on("click", function () {
    const resourceId = $(this).data("resource-id");

    if (!resourceId) {
      console.error("Resource ID not found");
      return;
    }

    $.ajax({
      url: `/api/resources/${resourceId}`,
      type: "DELETE",
      success: () => {
        window.location.href = "/";
      },
      error: () => {
        console.error("Failed to Delete Resource");
      },
    });
  });

  // edit mode not on by default
  let isEditing = false;

  // this edit function currently doesn't allow the topic to be editted.
  // the url description is also not edittable
  $("#edit-btn").on("click", function () {
    const resourceId = $(this).data("resource-id");

    // if not editting,
    if (!isEditing) {
      // store the current values
      const title = $(".resource-title").text().trim();
      const description = $(".resource-description").text().trim();
      const linkA = $(".resource-link");
      const linkName = linkA.data("link-name");
      const linkUrl = linkA.attr("href");

      // make the text change into input field
      $(".resource-title").replaceWith(
        `
        <label>Resource Title</label>
        <input type='text' class='resource-title-edit' value="${title}">`
      );
      $(".resource-description").replaceWith(
        `
        <label>Resource Description</label>
        <textarea class="resource-description-edit">${description}</textarea>`
      );
      linkA.replaceWith(`
        <div class="link-edit">
          <label>Link Name</label>
          <input type="text" class="link-name-edit" value="${linkName}">
          <input type="text" class="link-url-edit" value="${linkUrl}">
        </div>
      `);

      // the edit button text change to Save
      $(this).text("Save");
      // edit mode
      isEditing = true;
    } else {
      // needs to be an else because if you're already editting, then the isEditting is true and we'll send an ajax request to save.
      // Saving the changes
      const updatedtitle = $(".resource-title-edit").val().trim();
      const updatedDescription = $(".resource-description-edit").val().trim();
      const updatedLinkName = $(".link-name-edit").val().trim();
      const updatedLinkUrl = $(".link-url-edit").val().trim();

      $.ajax({
        url: `/api/resources/${resourceId}`,
        type: "PATCH",
        data: {
          title: updatedtitle,
          description: updatedDescription,
          link: {
            name: updatedLinkName,
            url: updatedLinkUrl,
          },
        },
        success: () => {
          //reload the page
          console.log("patch successful");
          location.reload();
        },
        error: () => {
          console.error("Failed to update resource");
        },
      });
    }
  });
});
