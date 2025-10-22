/* ---------- OPTIMIZED MAIN JS ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const logo = document.getElementById("logo");
  const toggleBtn = document.getElementById("theme-toggle");

  /* ---------- THEME TOGGLE ---------- */
  (function initThemeToggle() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      htmlEl.className = savedTheme;
      logo.src = savedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";
    }

    toggleBtn?.addEventListener("click", () => {
      const isDark = htmlEl.classList.contains("dark");
      htmlEl.classList.toggle("dark", !isDark);
      htmlEl.classList.toggle("light", isDark);

      localStorage.setItem("theme", isDark ? "light" : "dark");
      logo.src = isDark ? "/logo-light.png" : "/logo-dark.png";
    });
  })();

  /* ---------- BACK TO TOP ---------- */
  (function initBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - lastScroll) < 5) return;
      lastScroll = currentScroll;
      backToTop.classList.toggle("visible", currentScroll > 200);
    });
  })();

  /* ---------- MASONRY ANIMATION ---------- */
  (function initMasonryAnimations() {
    const links = document.querySelectorAll(".masonry a");
    if (!links.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    links.forEach((link, i) => {
      link.style.setProperty("--i", i);
      observer.observe(link);
    });
  })();

  /* ---------- LIGHTBOX ---------- */
  (function initLightbox(selector) {
    const containers = document.querySelectorAll(selector);
    if (!containers.length) return;

    let overlay = document.querySelector(".lightbox-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lightbox-overlay";

      const img = document.createElement("img");
      overlay.appendChild(img);

      const caption = document.createElement("div");
      caption.className = "lightbox-caption";
      overlay.appendChild(caption);

      const nav = document.createElement("div");
      nav.className = "lightbox-nav";

      const prev = document.createElement("button");
      prev.textContent = "‹";
      const next = document.createElement("button");
      next.textContent = "›";
      nav.appendChild(prev);
      nav.appendChild(next);

      const closeBtn = document.createElement("button");
      closeBtn.className = "lightbox-close";
      closeBtn.textContent = "×";

      overlay.appendChild(closeBtn);
      overlay.appendChild(nav);
      document.body.appendChild(overlay);

      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.classList.remove("active");
      });

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("active");
      });

      document.addEventListener("keydown", (e) => {
        if (!overlay.classList.contains("active")) return;
        if (e.key === "Escape") overlay.classList.remove("active");
        if (e.key === "ArrowLeft") prev.click();
        if (e.key === "ArrowRight") next.click();
      });
    }

    const imgEl = overlay.querySelector("img");
    const captionEl = overlay.querySelector(".lightbox-caption");
    const prevBtn = overlay.querySelector(".lightbox-nav button:first-child");
    const nextBtn = overlay.querySelector(".lightbox-nav button:last-child");

    containers.forEach((container) => {
      const links = Array.from(container.querySelectorAll("a"));
      if (!links.length) return;
      let currentIndex = 0;

      const showImage = (index) => {
        currentIndex = index;
        const link = links[currentIndex];
        const image = link.querySelector("img");
        const href = link.getAttribute("href") || "";
        const isImage = /\.(jpe?g|png|webp|gif)$/i.test(href);
        imgEl.src = isImage ? href : image?.src || href;
        captionEl.textContent = image?.alt || "";
        overlay.classList.add("active");
      };

      // Event delegation
      container.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        const href = link.getAttribute("href") || "";
        if (href === "#" || /\.(jpe?g|png|webp|gif)$/i.test(href)) {
          e.preventDefault();
          showImage(links.indexOf(link));
        }
      });

      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + links.length) % links.length;
        showImage(currentIndex);
      });

      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % links.length;
        showImage(currentIndex);
      });
    });
  })( ".masonry, .project-images, [data-lightbox]" );

  /* ---------- IMAGE PROTECTION ---------- */
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  /* ---------- COOKIE BANNER & OPTIONAL SCRIPTS ---------- */
  // 🔹 Učitavanje Analytics i Clarity nakon pristanka
  function enableOptionalCookies() {
    // --- Google Analytics ---
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-NSSCMXLXEV";
    document.head.appendChild(ga);

    ga.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-NSSCMXLXEV");
    };

    // --- Microsoft Clarity ---
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "tu1hpko5gt");
  }

  // 🔹 Obrisati postojeće kolačiće ako korisnik odbije
  function disableOptionalCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
  }

  // 🔹 Pohrana izbora
  function setConsent(value) {
    localStorage.setItem("cookie-consent", value);
    if (banner) banner.style.display = "none";

    if (value === "all") {
      enableOptionalCookies();
    } else {
      disableOptionalCookies();
    }
  }

  /* ---------- PROVJERA POSTOJEĆEG IZBORA ---------- */
  const choice = localStorage.getItem("cookie-consent");

  if (choice === "all") {
    enableOptionalCookies(); // odmah učitaj ako je već prihvatio
    return;
  }

  if (choice) return; // odbio ili samo nužne — ne prikazuj ponovno

  /* ---------- DINAMIČKO UČITAVANJE BANNERA ---------- */
  window.addEventListener("load", () => {
    const htmlLang = document.documentElement.lang || "en";
    const isCroatian =
      htmlLang.startsWith("hr") || window.location.pathname.startsWith("/hr");
    const cookieFile = isCroatian ? "/cookie-hr.html" : "/cookie.html";

    fetch(cookieFile)
      .then((res) => res.text())
      .then((html) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);

        banner = document.getElementById("cookieBanner");
        banner.style.display = "flex";

        // Dugmad
        const acceptBtn = document.getElementById("acceptAll");
        const necessaryBtn = document.getElementById("essentialOnly");
        const declineBtn = document.getElementById("rejectAll");

        acceptBtn?.addEventListener("click", () => setConsent("all"));
        necessaryBtn?.addEventListener("click", () =>
          setConsent("necessary")
        );
        declineBtn?.addEventListener("click", () => setConsent("none"));
      })
      .catch((err) =>
        console.error("Greška pri učitavanju cookie bannera:", err)
      );
  });
});
