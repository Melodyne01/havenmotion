/* ================================================================
   HUGEE — motion.js (§7 du brief Trame)
   Un seul pointermove, une seule boucle rAF, aucun listener scroll.
   ================================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Position du pointeur exposée globalement (lue par scene.js) */
  window.__pointer = { x: innerWidth / 2, y: innerHeight / 2 };

  /* ---------- A11 — accordéon FAQ (une seule ouverte, la 1re au chargement) ---------- */
  var faqs = [].slice.call(document.querySelectorAll(".faq"));
  function setFaq(f, open) {
    f.classList.toggle("open", open);
    f.querySelector(".faq-q").setAttribute("aria-expanded", open ? "true" : "false");
  }
  faqs.forEach(function (f, i) {
    setFaq(f, i === 0);
    f.querySelector(".faq-q").addEventListener("click", function () {
      var was = f.classList.contains("open");
      faqs.forEach(function (o) { setFaq(o, false); });
      if (!was) setFaq(f, true);
    });
  });

  /* ---------- Bascule tarifs (change prix + unité, rien d'autre) ---------- */
  var toggle = document.querySelector(".toggle");
  if (toggle) {
    var tBtns = [].slice.call(toggle.querySelectorAll("button"));
    tBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        tBtns.forEach(function (o) { o.classList.toggle("active", o === b); });
        var mode = b.dataset.mode; /* "projet" | "abo" */
        [].slice.call(document.querySelectorAll(".offer")).forEach(function (card) {
          var price = card.querySelector(".price"), unit = card.querySelector(".unit");
          price.textContent = price.dataset[mode];
          unit.textContent = unit.dataset[mode];
        });
      });
    });
  }

  /* ---------- A5 — compteurs ---------- */
  var ctrs = [].slice.call(document.querySelectorAll(".ctr"));
  function runCtr(el) {
    if (el._done) return; el._done = true;
    var to = +el.dataset.to, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduced) { el.textContent = pre + to + suf; return; }
    var t0 = performance.now();
    var tick = function (t) {
      var k = Math.min(1, (t - t0) / 1400);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + Math.round(to * e) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCtr(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    ctrs.forEach(function (c) { cio.observe(c); });
  } else ctrs.forEach(runCtr);

  /* ---------- A4 — révélation au scroll, triple filet ---------- */
  var revs = [].slice.call(document.querySelectorAll(".rev"));
  function reveal(el) { el.classList.add("on"); }
  /* 1. IntersectionObserver */
  if ("IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); rio.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    revs.forEach(function (r) { rio.observe(r); });
  }
  /* 2. Au chargement : tout ce qui est déjà à l'écran */
  revs.forEach(function (r) {
    if (r.getBoundingClientRect().top < innerHeight * 0.9) reveal(r);
  });
  /* 3. Balayage rAF dans la boucle plus bas */

  /* ---------- Effets souris : UN SEUL listener pointermove ---------- */
  var mags = [].slice.call(document.querySelectorAll(".mag"));
  var tilts = [].slice.call(document.querySelectorAll(".tilt"));
  var spots = [].slice.call(document.querySelectorAll(".spot"));

  if (!reduced && finePointer) {
    window.addEventListener("pointermove", function (ev) {
      var x = ev.clientX, y = ev.clientY;
      window.__pointer.x = x; window.__pointer.y = y;

      /* A8 — boutons magnétiques */
      mags.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy);
        var pull = d < 160 ? (1 - d / 160) : 0;
        el.style.transform = pull
          ? "translate(" + (dx * 0.28 * pull).toFixed(1) + "px," + (dy * 0.34 * pull).toFixed(1) + "px)"
          : "";
      });

      /* A9 — inclinaison 3D des cartes */
      tilts.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) {
          el.style.transform = ""; return;
        }
        var dx = (x - r.left) / r.width - 0.5, dy = (y - r.top) / r.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateY(" + (dx * 7).toFixed(2) + "deg) rotateX(" + (-dy * 7).toFixed(2) + "deg) translateY(-6px)";
      });

      /* A10 — halo curseur (boîtes à moins de 40px) */
      spots.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (x > r.left - 40 && x < r.right + 40 && y > r.top - 40 && y < r.bottom + 40) {
          el.style.setProperty("--mx", (x - r.left) + "px");
          el.style.setProperty("--my", (y - r.top) + "px");
        }
      });
    }, { passive: true });
  }

  /* ---------- Boucle rAF unique : A3 inertie, A4 secours, A6, A7 ---------- */
  var prgs = [].slice.call(document.querySelectorAll(".prg"));
  var marqs = [].slice.call(document.querySelectorAll(".marq"));
  var plxs = [].slice.call(document.querySelectorAll(".plx"));
  var lastY = scrollY, vel = 0;

  function frame() {
    var y = scrollY, vh = innerHeight;

    /* A6 — barre de progression */
    var total = document.documentElement.scrollHeight - vh;
    var k = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
    prgs.forEach(function (p) { p.style.transform = "scaleX(" + k.toFixed(4) + ")"; });

    /* A3 — bandeau à inertie */
    vel = vel * 0.88 + Math.abs(y - lastY) * 0.12;
    if (!reduced) {
      var speed = Math.max(6, 26 - Math.min(18, vel * 1.6));
      marqs.forEach(function (m) { m.style.animationDuration = speed.toFixed(1) + "s"; });
    }

    /* A7 — parallaxe */
    if (!reduced) {
      plxs.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        var speed2 = parseFloat(el.dataset.speed) || 0;
        el.style.transform = "translate3d(0," + (p * speed2 * 140).toFixed(1) + "px,0)";
      });
    }

    /* A4 — balayage de secours */
    for (var i = 0; i < revs.length; i++) {
      if (!revs[i].classList.contains("on") && revs[i].getBoundingClientRect().top < vh * 0.9) reveal(revs[i]);
    }

    lastY = y;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
