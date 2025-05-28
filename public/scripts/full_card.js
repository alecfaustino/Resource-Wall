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
});
