$(document).ready(() => {
  const userId = $("#profile-edit-btn").data("user-id");
  let isEditing = false;

  $("#profile-edit-btn").on("click", function () {
    console.log("Edit/Save clicked");
    if (!isEditing) {
      // store current values
      const name = $(".profile-name").text().trim();
      const email = $(".profile-email").text().trim();

      $(".profile-name").replaceWith(
        `
        <input type='text' class='profile-name-edit' value='${name}'>
        `
      );
      $(".profile-email").replaceWith(
        `
        <input type='text'
        class='profile-email-edit' value='${email}'>
        `
      );

      $(this).text("Save");
      isEditing = true;
    } else {
      const updatedName = $(".profile-name-edit").val().trim();
      const updateEmail = $(".profile-email-edit").val().trim();

      $.ajax({
        url: `/api/users/edit/${userId}`,
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({
          name: updatedName,
          email: updateEmail,
        }),
        success: () => {
          console.log("Profile edit success");
          location.reload();
        },
        error: () => {
          console.error("Failed to update profile");
        },
      });
    }
  });
});
