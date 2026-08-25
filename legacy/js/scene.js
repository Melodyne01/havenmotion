/* ================================================================
   HUGEE — scene.js (§7.12 du brief Trame)
   Une scène three.js indépendante par <canvas class="tjc">,
   data-mode="hero" (accueil) ou "ring" (tarifs).
   ================================================================ */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function init() {
    if (typeof THREE === "undefined") return; /* repli : les lueurs CSS suffisent */

    [].slice.call(document.querySelectorAll("canvas.tjc")).forEach(function (cv) {
      var mode = cv.dataset.mode || "hero";
      var renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.setSize(cv.clientWidth, cv.clientHeight, false);

      var w = cv.clientWidth || 1, h = cv.clientHeight || 1;
      var cam = new THREE.PerspectiveCamera(52, w / h, 0.1, 100);
      cam.position.z = mode === "hero" ? 16 : 13;
      var scene = new THREE.Scene();

      /* Particules */
      var N = mode === "hero" ? 900 : 420;
      var pos = new Float32Array(N * 3);
      for (var i = 0; i < N; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 34;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var dots = new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0x9184d9, size: 0.075, transparent: true, opacity: 0.75
      }));
      scene.add(dots);

      /* Solide fil de fer */
      var solidGeo = mode === "hero"
        ? new THREE.IcosahedronGeometry(5.2, 1)
        : new THREE.TorusKnotGeometry(3.1, 0.75, 120, 12);
      var solid = new THREE.Mesh(solidGeo, new THREE.MeshBasicMaterial({
        color: 0x4c5397, wireframe: true, transparent: true,
        opacity: mode === "hero" ? 0.42 : 0.32
      }));
      var baseX = mode === "hero" ? 8.5 : 9;
      var baseY = mode === "hero" ? 1.2 : 0.4;
      solid.position.set(baseX, baseY, -3);
      scene.add(solid);

      /* Petit icosaèdre accent */
      var halo = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.1, 0),
        new THREE.MeshBasicMaterial({ color: 0x9184d9, wireframe: true, transparent: true, opacity: 0.55 })
      );
      var haloBaseX = mode === "hero" ? -9 : -8;
      halo.position.set(haloBaseX, -2.6, 1);
      scene.add(halo);

      /* Dimensionnement : RO + garde par frame (un RO peut rater son premier
         tir si l'onglet démarre en arrière-plan → scène minuscule) */
      var ratio = Math.min(2, window.devicePixelRatio);
      function fit() {
        var cw = cv.clientWidth || 1, ch = cv.clientHeight || 1;
        if (cv.width !== Math.floor(cw * ratio) || cv.height !== Math.floor(ch * ratio)) {
          renderer.setSize(cw, ch, false);
          cam.aspect = cw / ch;
          cam.updateProjectionMatrix();
        }
      }
      var ro = new ResizeObserver(fit);
      ro.observe(cv);
      fit();

      var t = 0;
      function loop() {
        requestAnimationFrame(loop);
        var rect = cv.getBoundingClientRect(), vh = innerHeight;
        if (rect.bottom < -200 || rect.top > vh + 200) return; /* hors écran : pas de rendu */
        fit();

        t += 0.006;
        var ptr = window.__pointer || { x: innerWidth / 2, y: innerHeight / 2 };
        var px = (ptr.x - (rect.left + rect.width / 2)) / (rect.width / 2);
        var py = (ptr.y - (rect.top + rect.height / 2)) / (rect.height / 2);
        var prog = (vh - rect.top) / (vh + rect.height);

        dots.rotation.y = t * 0.35 + px * 0.35;
        dots.rotation.x = Math.sin(t * 0.6) * 0.08 + py * 0.2;
        dots.position.y = prog * 3.2;

        solid.rotation.y += 0.0035;
        solid.rotation.x += 0.0016;
        solid.position.x = baseX - px * 1.8;
        solid.position.y = baseY - py * 1.4 + prog * 2.4;

        halo.rotation.y -= 0.006;
        halo.rotation.z += 0.003;
        halo.position.x = haloBaseX - px * 3.2;
        halo.position.y = -2.6 - py * 2.2 - prog * 1.6;

        cam.position.x = px * 1.2;
        cam.position.y = -py * 0.8;
        cam.lookAt(0, 0, 0);

        renderer.render(scene, cam);
      }
      requestAnimationFrame(loop);

      window.addEventListener("pagehide", function () {
        ro.disconnect();
        renderer.dispose();
      }, { once: true });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
