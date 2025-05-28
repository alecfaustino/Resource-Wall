$(document).ready(() => {
  // click handler for return to resources
  $("#return-btn").on("click", () => {
    console.log("return-btn clicked");
    window.location.href = "/";
  });
});
