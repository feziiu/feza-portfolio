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

  // Click feedback: cursor flashes lime + a small star-dust burst
  var clickTimeout;
  document.addEventListener('mousedown', function (e) {
    cursor.classList.add('clicked');
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(function () {
      cursor.classList.remove('clicked');
    }, 260);
    spawnBurst(e.clientX, e.clientY);
  });

  function spawnBurst(x, y) {
    var count = 7;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.className = 'click-particle';
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      var dist = 26 + Math.random() * 18;
      particle.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      particle.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      document.body.appendChild(particle);
      particle.addEventListener('animationend', function () {
        this.remove();
      });
    }
  }
})();
