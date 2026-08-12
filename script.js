// =========================================================
// MounirLabs — Portfolio interactions
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Année dans le footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    // Ferme le menu quand on clique un lien (mobile)
    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  /* ---------- Lien de navigation actif au scroll ---------- */
  const sections = document.querySelectorAll("main section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", match);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Formulaire de contact ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    const validators = {
      name: (v) => v.trim().length >= 2 || "Merci d'indiquer votre nom.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Adresse e-mail invalide.",
      subject: (v) => v.trim().length >= 3 || "Merci de préciser un objet.",
      message: (v) => v.trim().length >= 10 || "Votre message doit contenir au moins 10 caractères.",
    };

    const showError = (field, message) => {
      const wrapper = field.closest(".field");
      const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
      wrapper.classList.toggle("has-error", Boolean(message));
      if (errorEl) errorEl.textContent = message === true ? "" : message || "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      ["name", "email", "subject", "message"].forEach((key) => {
        const field = form.elements[key];
        const result = validators[key](field.value);
        if (result !== true) isValid = false;
        showError(field, result);
      });

      if (!isValid) {
        status.textContent = "Merci de corriger les champs indiqués.";
        status.style.color = "#e2685f";
        return;
      }

      // Emplacement prévu pour une future connexion à un service d'envoi d'e-mails
      // (ex : EmailJS, Formspree, ou une API personnelle).
      status.style.color = "";
      status.textContent = "Message envoyé — merci, je vous répondrai rapidement !";
      form.reset();
    });

    // Efface l'erreur dès que l'utilisateur corrige le champ
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => showError(el, ""));
    });
  }
});
