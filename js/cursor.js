(function () {
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return;

  document.body.classList.add('has-custom-cursor');
  var cursor = document.getElementById('cursor-star');

  var mouseX = 0, mouseY = 0;
  var posX = 0, posY = 0;
  var shown = false;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!shown) {
      posX = mouseX; posY = mouseY;
      shown = true;
      cursor.classList.add('visible');
    }
  });

  window.addEventListener('mouseleave', function () {
    cursor.classList.remove('visible');
  });

  function raf() {
    posX += (mouseX - posX) * 0.18;
    posY += (mouseY - posY) * 0.18;
    cursor.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) translate(-50%, -50%)';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var hoverTargets = 'a, button, input, textarea, .card';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) cursor.classList.add('grow');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('grow');
  });
})();
