// Client facing scripts here
$(document).ready(function () {
  // target the form id and add submit listener
  console.log('App.js is loaded');
  $('#create-form').on('submit', function (e) {
    // prevent page reload on submit
    e.preventDefault();

    const data = {
      title: $('input[name="title"]').val(),
      description: $('input[name="description"]').val(),
      link: {
        name: $('#link-name').val(),
        url: $('#link-url').val(),
        description: $('#link-description').val()
      }
    };

    $.ajax({
      url: '/api/resources',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (res) {
        // handle redirect
        window.location.href = '/';
      },
      error: function () {
        // Simply output an error message
        alert('Error on form submission. Please try again.');
      }
    });
  });
});
