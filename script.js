/* =====================================================
   VELARIS BOARDROOM ELITE – COMPLETE PRO SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HELPERS
    ========================= */
  
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);
  
    /* =========================
       DARK / LIGHT MODE
    ========================= */
  
    const themeToggle = $("#themeToggle");
  
    const icons = {
      sun: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
      moon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3
          7 7 0 0021 12.79z"/>
        </svg>`
    };
  
    function applyTheme(theme) {
      if (!themeToggle) return;
      document.body.classList.toggle("dark", theme === "dark");
      themeToggle.innerHTML = theme === "dark" ? icons.sun : icons.moon;
    }
  
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
  
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
      });
    }
  
    /* =========================
       STICKY HEADER
    ========================= */
  
    const header = $(".header");
  
    window.addEventListener("scroll", () => {
      if (!header) return;
      header.classList.toggle("shrink", window.scrollY > 60);
    });
  
    /* =========================
       SCROLL PROGRESS
    ========================= */
  
    const progressBar = $("#progressBar");
  
    window.addEventListener("scroll", () => {
      if (!progressBar) return;
  
      const scrollTop = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
  
      const progress = (scrollTop / height) * 100;
      progressBar.style.width = progress + "%";
    });
  
    /* =========================
       MOBILE MENU
    ========================= */
  
    const hamburger = $("#hamburger");
    const mobileMenu = $("#mobileMenu");
  
    function closeMenu() {
      hamburger?.classList.remove("active");
      mobileMenu?.classList.remove("open");
      document.body.style.overflow = "";
    }
  
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu?.classList.toggle("open");
  
        document.body.style.overflow =
          mobileMenu?.classList.contains("open") ? "hidden" : "";
      });
    }
  
    /* =========================
       SMOOTH SCROLL
    ========================= */
  
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const target = $(this.getAttribute("href"));
        if (!target) return;
  
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        closeMenu();
      });
    });
  
    /* =========================
       REVEAL ON SCROLL
    ========================= */
  
    const reveals = $$(".reveal");
  
    if (reveals.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, { threshold: 0.2 });
  
      reveals.forEach(section => observer.observe(section));
    }
  
    /* =========================
       COUNTERS
    ========================= */
  
    const counters = $$(".counter");
  
    if (counters.length) {
      const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
  
          const counter = entry.target;
          const target = +counter.dataset.target;
          let count = 0;
  
          function update() {
            const increment = target / 120;
            count += increment;
  
            if (count < target) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(update);
            } else {
              counter.innerText = target;
            }
          }
  
          update();
          counterObserver.unobserve(counter);
        });
      }, { threshold: 0.5 });
  
      counters.forEach(counter => counterObserver.observe(counter));
    }
  
    /* =========================
       TOAST SYSTEM
    ========================= */
  
    window.showToast = function (message) {
      const toast = $("#toast");
      if (!toast) return;
  
      toast.innerText = message;
      toast.classList.add("show");
  
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    };
  
    /* =========================
       CONTACT FORM – REAL EMAILJS
    ========================= */
  
    if (typeof emailjs !== "undefined") {
      emailjs.init("service_i5cqjqr");
    }
  
    const form = $("#contactForm");
    const submitBtn = $("#submitBtn");
  
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const name = form.user_name.value.trim();
        const email = form.user_email.value.trim();
        const message = form.message.value.trim();
  
        if (name.length < 3)
          return showToast("Name must be at least 3 characters.");
  
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return showToast("Invalid email address.");
  
        if (message.length < 10)
          return showToast("Message must be at least 10 characters.");
  
        if (!submitBtn) return;
  
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
  
        emailjs.sendForm(
         "service_kz86rcc",
         "template_i5i0ojz",
          this
        )
        .then(() => {
          showToast("Message sent successfully!");
          form.reset();
        })
        .catch((error) => {
          console.error(error);
          showToast("Error sending message.");
        })
        .finally(() => {
          submitBtn.innerText = "Send Message";
          submitBtn.disabled = false;
        });
  
      });
    }
  
    /* =========================
       3D BACKGROUND SAFE
    ========================= */
  
    if (typeof THREE !== "undefined") {
  
      const canvas = $("#bg");
      if (!canvas) return;
  
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
  
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
      });
  
      renderer.setSize(window.innerWidth, window.innerHeight);
  
      const geometry = new THREE.IcosahedronGeometry(6, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
  
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);
  
      camera.position.z = 18;
  
      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002;
        globe.rotation.x += 0.0005;
        renderer.render(scene, camera);
      }
  
      animate();
  
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  
  });