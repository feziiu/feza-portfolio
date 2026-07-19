// Contact form — currently client-side only.
// TODO: wire this up to a real backend (Formspree, EmailJS, etc.) when ready.
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      return;
    }

    status.textContent = 'Thanks, ' + name + '! Your message has been noted — form is not yet connected to email.';
    form.reset();
  });
})();
