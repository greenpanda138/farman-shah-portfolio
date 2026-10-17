/* Farman Shah — Portfolio interactions */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById("hamburger");
  var nav = document.getElementById("mainNav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
      burger.classList.toggle("open");
      burger.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("open");
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page").toLowerCase() === page) a.classList.add("active");
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute("data-count")),
            suffix = el.getAttribute("data-suffix") || "",
            dur = 1400, start = null;
        cio.unobserve(el);
        function tick(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Skill bars ---------- */
  var bars = document.querySelectorAll(".bar i[data-w]");
  if (bars.length && "IntersectionObserver" in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.style.width = e.target.getAttribute("data-w"); bio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { bio.observe(b); });
  }

  /* ---------- Testimonials ---------- */
  var slides = document.querySelectorAll(".testi");
  var dotsWrap = document.getElementById("testiDots");
  if (slides.length && dotsWrap) {
    var idx = 0, timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Show testimonial " + (i + 1));
      if (i === 0) d.classList.add("on");
      d.addEventListener("click", function () { show(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function show(i) {
      idx = i;
      slides.forEach(function (s, k) { s.classList.toggle("show", k === i); });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { show((idx + 1) % slides.length); }, 6000); }
    show(0); restart();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- Contact form ----------
     Tries the backend API first; on a static host (GitHub Pages)
     it gracefully falls back to the visitor's email app. */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");
    function setStatus(kind, msg) {
      status.className = "form-status " + kind;
      status.textContent = msg;
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        service: form.service.value,
        budget: form.budget.value,
        message: form.message.value.trim()
      };
      if (!data.name || !data.email || !data.message) {
        setStatus("info", "Please fill in your name, email and message.");
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = "Sending…"; btn.disabled = true;

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("api");
        return r.json();
      }).then(function () {
        setStatus("ok", "Message sent successfully! I'll get back to you within 24 hours.");
        form.reset();
      }).catch(function () {
        /* Static-host fallback: open the visitor's mail app pre-filled */
        var subject = encodeURIComponent("Project enquiry from " + data.name + " — " + data.service);
        var body = encodeURIComponent(
          "Name: " + data.name + "\nEmail: " + data.email +
          "\nService: " + data.service + "\nBudget: " + data.budget +
          "\n\n" + data.message
        );
        setStatus("info", "Opening your email app to send the message…");
        setTimeout(function () {
          window.location.href = "mailto:farman.shah.3211@gmail.com?subject=" + subject + "&body=" + body;
        }, 600);
      }).finally(function () {
        btn.textContent = original; btn.disabled = false;
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ---------- Hero typed effect ---------- */
(function () {
  var el = document.getElementById("typed");
  if (!el) return;
  var words = ["Shopify stores", "Meta ad campaigns", "custom-coded websites", "e-commerce builds", "portfolio sites", "landing pages that convert"];
  var wi = 0, ci = 0, del = false;
  (function tick() {
    var w = words[wi];
    el.textContent = w.slice(0, ci);
    var delay;
    if (!del) { ci++; delay = 70; if (ci > w.length) { del = true; delay = 1600; } }
    else { ci--; delay = 35; if (ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; delay = 400; } }
    setTimeout(tick, delay);
  })();
})();

/* ---------- Work filters ---------- */
(function () {
  var bar = document.getElementById("workFilters");
  var grid = document.getElementById("workGrid");
  if (!bar || !grid) return;
  var cards = grid.querySelectorAll(".work-card");
  bar.querySelectorAll("button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      bar.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (c) {
        c.classList.toggle("hide", !(f === "all" || c.getAttribute("data-cat") === f));
      });
    });
  });
})();
