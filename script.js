/* ---------- THEME TOGGLE ---------- */
const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const logo = document.getElementById('logo');

    // Učitaj spremljenu temu ako postoji
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      htmlEl.className = savedTheme;
      logo.src = savedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';
    }

    // Klik event za promjenu teme i loga
    toggleBtn.addEventListener('click', () => {
      if (htmlEl.classList.contains('dark')) {
        htmlEl.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
        logo.src = '/logo-light.png';
      } else {
        htmlEl.classList.replace('light', 'dark');
        localStorage.setItem('theme', 'dark');
        logo.src = '/logo-dark.png';
      }
    });

/* ---------- BACK TO TOP ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });
});


/* ---------- MASONRY ANIMATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".masonry a");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  links.forEach((link, i) => {
    link.style.setProperty("--i", i);
    observer.observe(link);
  });
});

/* ---------- LIGHTBOX ---------- */
function initLightbox(selector) {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  // Kreiraj overlay ako ne postoji
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

    // Zatvaranje overlaya
    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.classList.remove("active");
    });

    // Tipkovnica
    document.addEventListener("keydown", e => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") overlay.classList.remove("active");
      if (e.key === "ArrowLeft") prev.click();
      if (e.key === "ArrowRight") next.click();
    });
  }

  const img = overlay.querySelector("img");
  const caption = overlay.querySelector(".lightbox-caption");
  const prev = overlay.querySelector(".lightbox-nav button:first-child");
  const next = overlay.querySelector(".lightbox-nav button:last-child");

  containers.forEach(container => {
    // Sve slike u galeriji
    const links = Array.from(container.querySelectorAll("a"));
    if (!links.length) return;

    let currentIndex = 0;

    const showImage = index => {
      currentIndex = index;
      const link = links[currentIndex];
      const imgEl = link.querySelector("img");

      // Ako href vodi na .jpg/.png/... koristi taj URL, inače koristi thumbnail src
      const href = link.getAttribute("href");
      const isImageLink = /\.(jpe?g|png|webp|gif)$/i.test(href);
      const fullSrc = isImageLink ? href : (imgEl ? imgEl.src : href);

      img.src = fullSrc;
      caption.textContent = imgEl ? imgEl.alt || "" : "";
      overlay.classList.add("active");
    };

    links.forEach((link, i) => {
      const href = link.getAttribute("href") || "";
      const isImageLink = /\.(jpe?g|png|webp|gif)$/i.test(href);

      link.addEventListener("click", e => {
        // Otvara lightbox samo ako je href="#" ili vodi direktno na sliku
        if (href === "#" || isImageLink) {
          e.preventDefault();
          showImage(i);
        }
      });
    });

    prev.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + links.length) % links.length;
      showImage(currentIndex);
    });

    next.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % links.length;
      showImage(currentIndex);
    });
  });
}

// Inicijalizacija lightboxa
document.addEventListener("DOMContentLoaded", () => {
  initLightbox(".masonry, .project-images, [data-lightbox]");
});



/* ---------- ZAŠTITA SLIKA-- */
document.addEventListener("contextmenu", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- HELPER FUNKCIJE ---------- */

  // 🔹 Učitavanje Analytics i Clarity
  function enableOptionalCookies() {
    // --- Google Analytics ---
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-NSSCMXLXEV"; // ⬅️ zamijeni svojim ID-em
    document.head.appendChild(ga);

    ga.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-NSSCMXLXEV'); // ⬅️ isti ID
    };

    // --- Microsoft Clarity ---
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; // ⬅️ zamijeni svojim ID-em
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "XXXXXXXXXX");
  }

  // 🔹 Ako korisnik odbije, možeš obrisati postojeće kolačiće (opcionalno)
  function disableOptionalCookies() {
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
  }

  // 🔹 Pohrana izbora
  function setConsent(value) {
    localStorage.setItem("cookie-consent", value);
    banner.style.display = "none";

    if (value === "all") {
      enableOptionalCookies();
    } else {
      disableOptionalCookies();
    }
  }

  /* ---------- PROVJERA POSTOJEĆEG IZBORA ---------- */
  const choice = localStorage.getItem("cookie-consent");

  if (choice === "all") {
    enableOptionalCookies();
    return; // već prihvatio sve → ne prikazuj banner
  }

  if (choice) return; // već odbio ili prihvatio samo nužne → ne prikazuj ponovno

  /* ---------- DINAMIČKO UČITAVANJE BANNERA ---------- */
  const htmlLang = document.documentElement.lang || "en";
  const isCroatian = htmlLang.startsWith("hr") || window.location.pathname.startsWith("/hr");
  const cookieFile = isCroatian ? "/cookie-hr.html" : "/cookie.html";

  fetch(cookieFile)
    .then(res => res.text())
    .then(html => {
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
      necessaryBtn?.addEventListener("click", () => setConsent("necessary"));
      declineBtn?.addEventListener("click", () => setConsent("none"));
    })
    .catch(err => console.error("Greška pri učitavanju cookie bannera:", err));
});