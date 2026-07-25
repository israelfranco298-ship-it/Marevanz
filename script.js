/* =========================================================================
   MAREVAN'Z — SALÓN DE EVENTOS Y CONVENCIONES
   script.js
   ========================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     CONFIGURACIÓN — EDITAR AQUÍ
     --------------------------------------------------------------------- */

  // CAMBIAR_WHATSAPP: número de WhatsApp en formato internacional, sin espacios ni símbolos.
  const WHATSAPP_NUMBER = "526865640768";

  // Mensajes prellenados para cada contexto de botón.
  const WHATSAPP_MESSAGES = {
    hero: "Hola, vi la página de Marevan'z Salón de Eventos y me gustaría recibir información para realizar un evento.",
    visita: "Hola, me gustaría agendar una visita para conocer Marevan'z Salón de Eventos.",
    fecha: "Hola, quiero consultar disponibilidad para una fecha en Marevan'z Salón de Eventos.",
  };

  // CAMBIAR_GOOGLE_MAPS: enlaces reales de Google Maps para "Cómo llegar" y "Ver opiniones".
  const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Calz.+Manuel+G%C3%B3mez+Mor%C3%ADn+1836%2C+Rivera%2C+21259+Mexicali%2C+B.C.";
  const GOOGLE_MAPS_REVIEWS_URL = "#"; // CAMBIAR_GOOGLE_MAPS: pegar aquí el enlace directo a las opiniones de Google del negocio
  const GOOGLE_MAPS_PROFILE_URL = "#"; // CAMBIAR_GOOGLE_MAPS: pegar aquí el enlace del perfil de Google Maps del negocio

  // CAMBIAR_FACEBOOK: enlace real de la página de Facebook.
  const FACEBOOK_URL = "https://facebook.com"; // CAMBIAR_FACEBOOK

  /* ---------------------------------------------------------------------
     Utilidad: construir enlace de WhatsApp
     --------------------------------------------------------------------- */
  function buildWhatsAppLink(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  /* ---------------------------------------------------------------------
     Botones genéricos de WhatsApp (.js-whatsapp)
     --------------------------------------------------------------------- */
  function initWhatsAppButtons() {
    const buttons = document.querySelectorAll(".js-whatsapp");
    buttons.forEach((btn) => {
      const key = btn.getAttribute("data-wa-message") || "hero";
      const message = WHATSAPP_MESSAGES[key] || WHATSAPP_MESSAGES.hero;
      btn.setAttribute("href", buildWhatsAppLink(message));
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener");
    });
  }

  /* ---------------------------------------------------------------------
     Enlaces de Google Maps / Facebook
     --------------------------------------------------------------------- */
  function initExternalLinks() {
    const directLinks = document.querySelectorAll("#comoLlegarLink");
    directLinks.forEach((a) => a.setAttribute("href", GOOGLE_MAPS_DIRECTIONS_URL));

    const reviewLinks = document.querySelectorAll("#googleReviewsLink");
    reviewLinks.forEach((a) => a.setAttribute("href", GOOGLE_MAPS_REVIEWS_URL));

    const footerMaps = document.querySelectorAll("#footerMapsLink");
    footerMaps.forEach((a) => a.setAttribute("href", GOOGLE_MAPS_PROFILE_URL));

    const fbLinks = document.querySelectorAll("#facebookLink");
    fbLinks.forEach((a) => a.setAttribute("href", FACEBOOK_URL));
  }

  /* ---------------------------------------------------------------------
     Formulario de cotización -> genera mensaje de WhatsApp
     --------------------------------------------------------------------- */
  function initQuoteForm() {
    const form = document.getElementById("quoteForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = form.nombre.value.trim();
      const evento = form.evento.value.trim();
      const fechaRaw = form.fecha.value;
      const invitados = form.invitados.value.trim();
      const telefono = form.telefono.value.trim();
      const mensajeAdicional = form.mensaje.value.trim();

      let fecha = "No especificada";
      if (fechaRaw) {
        const d = new Date(fechaRaw + "T00:00:00");
        fecha = d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
      }

      let mensaje = "Hola, quiero solicitar información para realizar un evento en Marevan'z.\n\n";
      mensaje += `Nombre: ${nombre || "No especificado"}\n`;
      mensaje += `Evento: ${evento || "No especificado"}\n`;
      mensaje += `Fecha: ${fecha}\n`;
      mensaje += `Invitados: ${invitados || "No especificado"}\n`;
      mensaje += `Teléfono: ${telefono || "No especificado"}\n`;
      if (mensajeAdicional) {
        mensaje += `Mensaje adicional: ${mensajeAdicional}\n`;
      }
      mensaje += "\n¿Me podrían proporcionar información sobre disponibilidad y opciones?";

      const link = buildWhatsAppLink(mensaje);
      window.open(link, "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------------------
     Header: fondo al hacer scroll + menú móvil
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById("siteHeader");
    const toggle = document.getElementById("navToggle");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Cerrar el menú al elegir un enlace
      document.querySelectorAll(".main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
          header.classList.remove("nav-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     Animaciones al hacer scroll (reveal)
     --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
     Galería: filtros + lightbox
     --------------------------------------------------------------------- */
  function initGallery() {
    const filters = document.querySelectorAll(".gallery-filter");
    const items = Array.from(document.querySelectorAll(".gallery-item"));
    if (items.length === 0) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.getAttribute("data-filter");
        items.forEach((item) => {
          const match = filter === "all" || item.getAttribute("data-cat") === filter;
          item.style.display = match ? "" : "none";
        });
      });
    });

    // Lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    let currentIndex = 0;

    function getVisibleItems() {
      return items.filter((item) => item.style.display !== "none");
    }

    function openLightbox(index) {
      const visible = getVisibleItems();
      if (visible.length === 0) return;
      currentIndex = index;
      const img = visible[currentIndex].querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    function showRelative(offset) {
      const visible = getVisibleItems();
      if (visible.length === 0) return;
      currentIndex = (currentIndex + offset + visible.length) % visible.length;
      const img = visible[currentIndex].querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    items.forEach((item, idx) => {
      item.addEventListener("click", () => {
        const visible = getVisibleItems();
        const visibleIndex = visible.indexOf(item);
        openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => showRelative(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => showRelative(1));

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showRelative(-1);
      if (e.key === "ArrowRight") showRelative(1);
    });
  }

  /* ---------------------------------------------------------------------
     FAQ acordeón
     --------------------------------------------------------------------- */
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        faqItems.forEach((i) => i.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Año en el footer
     --------------------------------------------------------------------- */
  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     Inicialización
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initWhatsAppButtons();
    initExternalLinks();
    initQuoteForm();
    initHeader();
    initReveal();
    initGallery();
    initFAQ();
    initYear();
  });
})();
