(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /*  Icon set — small inline SVGs, injected in place of {icon:name}    */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5"/></svg>',
    figma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="17.5" r="3"/><path d="M9 3h3a3.5 3.5 0 0 1 0 7H9V3Z"/><path d="M9 10h3.5a3.5 3.5 0 0 1 0 7H9v-7Z"/></svg>',
    puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3a2 2 0 1 1 4 0h3v3a2 2 0 1 0 0 4v3h-3a2 2 0 1 1-4 0H4v-3a2 2 0 1 0 0-4V8Z"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r=".6" fill="currentColor" stroke="none"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V12c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5"/><path d="M4 12v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V12"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2-2 2.7-2.7Z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5v-7Z"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-4 2 2-6 4-2Z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C10 4 4 10 4 18c8 0 14-6 14-14Z"/><path d="M5 19c3-3 6-7 15-15"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>'
  };

  function injectIcons() {
    var re = /^\{icon:([a-zA-Z0-9_-]+)\}$/;
    document.querySelectorAll("body *").forEach(function (el) {
      if (el.children.length === 0) {
        var t = (el.textContent || "").trim();
        var m = t.match(re);
        if (m && ICONS[m[1]]) {
          el.innerHTML = ICONS[m[1]];
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Nav: scrolled state, mobile menu, active link, smooth anchors     */
  /* ------------------------------------------------------------------ */
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("nav-toggle");
    var mobileMenu = document.getElementById("mobile-menu");

    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("open");
      mobileMenu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Reveal on scroll                                                  */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /*  Project modal                                                     */
  /* ------------------------------------------------------------------ */
  var PROJECT_DETAILS = {
    ecommerce: {
      tag: "Full-stack · Admin platform",
      title: "E-Commerce Admin Portal",
      overview: "A modern administration platform built to manage every side of an e-commerce operation from a single, organized interface.",
      problem: "E-commerce operations need a reliable way to manage products, orders, and users without juggling separate tools or manual processes.",
      solution: "A centralized admin portal with role-based access, structured data tables, and a dashboard that surfaces the information that matters day to day.",
      features: ["Product management", "Admin dashboard", "Authentication", "Data tables", "API integration", "Responsive interface"],
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      contribution: "Designed and built the admin interface end to end, integrated the REST API layer, and implemented JWT-based authentication.",
      github: "https://github.com/SandaruwanSena"
    },
    metermate: {
      tag: "Utility application",
      title: "MeterMate",
      overview: "A utility-focused application that makes electricity meter reading faster and less error-prone using simple digital tools.",
      problem: "Manual meter reading is slow and prone to transcription errors, especially across many locations.",
      solution: "A mobile-friendly workflow that combines QR scanning and map-based location context to speed up and verify each reading.",
      features: ["QR code scanning", "Electricity meter reading", "Google Maps integration", "User-friendly interface"],
      tech: ["React", "Modern web technologies"],
      contribution: "Built the core scanning and reading workflow and integrated location mapping for each meter.",
      github: "https://github.com/SandaruwanSena"
    },
    bugzid: {
      tag: "Applied AI · Agriculture",
      title: "BugzID",
      overview: "An AI-powered tool that helps farmers identify insect pests directly from a photo, in the field.",
      problem: "Farmers often lack quick access to pest-identification expertise, which can delay decisions that protect a harvest.",
      solution: "An image-based identification flow that returns useful, farmer-focused information to support faster agricultural decisions.",
      features: ["AI-powered pest identification", "Image-based analysis", "Farmer-focused UX", "Practical real-world application"],
      tech: ["Computer Vision", "Applied AI"],
      contribution: "Worked on the identification pipeline and designed the interface around a farmer-first experience.",
      github: "https://github.com/SandaruwanSena"
    },
    boc: {
      tag: "UX/UI case study",
      title: "BOC B App — UX Redesign",
      overview: "A UX/UI redesign concept exploring how the Bank of Ceylon mobile banking app could feel simpler and more modern to use.",
      problem: "Mobile banking apps can become cluttered over time, making everyday actions harder to find and complete.",
      solution: "A redesign concept focused on streamlined navigation, biometric login, and quicker access to common actions like payments and fixed deposits.",
      features: ["Streamlined navigation", "Modern visual design", "Biometric login", "Personalization", "Fixed deposit integration", "Quick payment functionality"],
      tech: ["UI/UX Design", "Figma"],
      contribution: "Led the end-to-end redesign concept — research framing, wireframes, and final UI."
    }
  };

  function buildModalContent(key) {
    var d = PROJECT_DETAILS[key];
    if (!d) return "";
    var featuresHtml = d.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
    var techHtml = d.tech.map(function (t) { return '<span class="chip chip-sm">' + t + "</span>"; }).join("");
    var githubBtn = d.github
      ? '<a href="' + d.github + '" target="_blank" rel="noopener" class="btn btn-small btn-outline">View GitHub</a>'
      : "";

    return (
      '<span class="project-tag">' + d.tag + '</span>' +
      "<h3 id=\"modal-title\">" + d.title + "</h3>" +
      '<div class="modal-block"><h4>Overview</h4><p>' + d.overview + "</p></div>" +
      '<div class="modal-block"><h4>Problem</h4><p>' + d.problem + "</p></div>" +
      '<div class="modal-block"><h4>Solution</h4><p>' + d.solution + "</p></div>" +
      '<div class="modal-block"><h4>Features</h4><ul>' + featuresHtml + "</ul></div>" +
      '<div class="modal-block"><h4>Technologies</h4><div class="chip-row">' + techHtml + "</div></div>" +
      '<div class="modal-block"><h4>My contribution</h4><p>' + d.contribution + "</p></div>" +
      '<div class="project-actions">' + githubBtn + "</div>"
    );
  }

  function initModal() {
    var overlay = document.getElementById("modal-overlay");
    var content = document.getElementById("modal-content");
    var closeBtn = document.getElementById("modal-close");
    var lastFocused = null;

    function open(key) {
      content.innerHTML = buildModalContent(key);
      overlay.classList.add("open");
      lastFocused = document.activeElement;
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn.getAttribute("data-open-modal"));
      });
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Contact form validation (no backend — front-end only)             */
  /* ------------------------------------------------------------------ */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var note = document.getElementById("form-note");

    function setError(fieldId, msg) {
      var field = document.getElementById(fieldId);
      var err = document.getElementById("err-" + fieldId);
      field.closest(".field").classList.toggle("error", !!msg);
      err.textContent = msg || "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var valid = true;

      if (!name) { setError("name", "Please enter your name."); valid = false; }
      else setError("name", "");

      if (!email) { setError("email", "Please enter your email."); valid = false; }
      else if (!emailRe.test(email)) { setError("email", "Please enter a valid email address."); valid = false; }
      else setError("email", "");

      if (!message || message.length < 10) { setError("message", "Please enter a message (at least 10 characters)."); valid = false; }
      else setError("message", "");

      if (!valid) {
        note.textContent = "";
        return;
      }

      // No backend is wired up. This is where a request to an email
      // service (e.g. Formspree, Resend, EmailJS) would be sent.
      note.textContent = "Thanks, " + name.split(" ")[0] + " — this form isn't connected to an email service yet, so please reach out directly at sandaru.cds@gmail.com in the meantime.";
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Back to top                                                       */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    injectIcons();
    initNav();
    initReveal();
    initModal();
    initForm();
    initBackToTop();
  });
})();
