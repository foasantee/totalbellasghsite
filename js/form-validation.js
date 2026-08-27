(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var fields = {
    name: {
      input: document.getElementById("field-name"),
      error: document.getElementById("error-name"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter your full name.";
      }
    },
    email: {
      input: document.getElementById("field-email"),
      error: document.getElementById("error-email"),
      validate: function (value) {
        if (value.trim().length === 0) return "Please enter your email address.";
        if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
        return "";
      }
    },
    phone: {
      input: document.getElementById("field-phone"),
      error: document.getElementById("error-phone"),
      validate: function () {
        return ""; // optional field, no validation required
      }
    },
    message: {
      input: document.getElementById("field-message"),
      error: document.getElementById("error-message"),
      validate: function (value) {
        if (value.trim().length === 0) return "Please enter a message.";
        if (value.trim().length < 10) return "Message should be at least 10 characters.";
        return "";
      }
    }
  };

  function showError(field, message) {
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    field.error.textContent = message;
  }

  function validateField(key) {
    var field = fields[key];
    var message = field.validate(field.input.value);
    showError(field, message);
    return message === "";
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("blur", function () {
      validateField(key);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isFormValid = Object.keys(fields).reduce(function (valid, key) {
      var fieldValid = validateField(key);
      return valid && fieldValid;
    }, true);

    if (!isFormValid) {
      status.className = "form-status form-status--hidden";
      var firstInvalid = Object.keys(fields)
        .map(function (key) { return fields[key]; })
        .find(function (field) { return field.input.getAttribute("aria-invalid") === "true"; });
      if (firstInvalid) firstInvalid.input.focus();
      return;
    }

    /* Stub: no backend/email service is wired up yet. Swap this block for a
       real network request (e.g. fetch to a form-handling endpoint) once one
       is available; until then we just show a static success message. */
    status.textContent = "Thanks — your message has been received. We'll be in touch soon.";
    status.className = "form-status form-status--success";
    form.reset();
    Object.keys(fields).forEach(function (key) {
      showError(fields[key], "");
    });
  });
})();
