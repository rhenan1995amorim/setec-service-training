/* ============================================
   Grupo SETEC — Páginas de NR
   Luz/aurora moderna que acompanha o mouse no fundo
   ============================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bg = document.querySelector('.nr-geo-bg');
  if (!bg) return;

  bg.innerHTML = '';
  var a = document.createElement('div'); a.className = 'nr-glow nr-glow--a';
  var b = document.createElement('div'); b.className = 'nr-glow nr-glow--b';
  var c = document.createElement('div'); c.className = 'nr-glow nr-glow--c';
  bg.appendChild(b); bg.appendChild(a); bg.appendChild(c);

  function place(el, x, y) {
    el.style.transform = 'translate3d(' + (x - el.offsetWidth / 2).toFixed(1) + 'px,' +
                                          (y - el.offsetHeight / 2).toFixed(1) + 'px,0)';
  }

  // alvo (mouse) e posições atuais de cada camada
  var tx = window.innerWidth * 0.5, ty = window.innerHeight * 0.4;
  var ax = tx, ay = ty, bx = tx, by = ty, cx = tx, cy = ty;

  // posição inicial estática
  place(a, ax, ay); place(b, bx, by); place(c, cx, cy);
  if (reduce) return;   // sem seguir o mouse se o usuário prefere menos movimento

  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  function frame() {
    ax += (tx - ax) * 0.12;            // camada A: rápida (cobre)
    ay += (ty - ay) * 0.12;
    bx += (tx - bx) * 0.05;            // camada B: lenta (azul) → rastro/aurora
    by += (ty - by) * 0.05;
    cx += (tx - cx) * 0.08;            // camada C: média (teal)
    cy += (ty - cy) * 0.08;
    place(a, ax, ay);
    place(b, bx, by);
    place(c, cx, cy);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
