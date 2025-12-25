(() => {
  "use strict";

  /* =========================
     THEME (DARK / LIGHT)
  ========================== */

  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const updateImageTheme = (selectedTheme) => {
    const images = document.querySelectorAll(".techs");

    const theme =
      selectedTheme === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : selectedTheme;

    images.forEach((img) => {
      if (img.src.includes("?theme=")) {
        img.src = img.src.replace(/(theme=)(light|dark)/, `$1${theme}`);
      }
    });
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      theme === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
    );

    updateImageTheme(theme);
  };

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");
    if (!themeSwitcher) return;

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector(".theme-icon-active use");
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );

    if (!btnToActive) return;

    const svgOfActiveBtn = btnToActive
      .querySelector("svg use")
      ?.getAttribute("href");

    document.querySelectorAll("[data-bs-theme-value]").forEach((el) => {
      el.classList.remove("active");
      el.setAttribute("aria-pressed", "false");
    });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");

    if (activeThemeIcon && svgOfActiveBtn) {
      activeThemeIcon.setAttribute("href", svgOfActiveBtn);
    }

    if (themeSwitcherText) {
      themeSwitcher.setAttribute(
        "aria-label",
        `${themeSwitcherText.textContent} (${theme})`
      );
    }

    if (focus) themeSwitcher.focus();
  };

  // Set theme saat pertama load
  setTheme(getPreferredTheme());

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());
    updateImageTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });

  // Auto update jika OS theme berubah
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getStoredTheme()) {
        setTheme(getPreferredTheme());
        updateImageTheme(getPreferredTheme());
      }
    });

  /* =========================
     CLOCK (REAL TIME)
  ========================== */

  function updateTime() {
    const timeEl = document.getElementById("time");
    if (timeEl) {
      timeEl.innerHTML = new Date().toLocaleTimeString();
    }
  }

  setInterval(updateTime, 1000);
  updateTime();

  /* =========================
     AUTO TYPING TEXT
  ========================== */

  const texts = [ "Web Developer"];
  const targetElement = document.getElementById("type");

  if (targetElement) {
    let currentTextIndex = 0;
    let charIndex = 0;
    const delay = 100;
    const pauseBetweenTexts = 2000;

    function autoWrite() {
      if (charIndex < texts[currentTextIndex].length) {
        targetElement.innerHTML += texts[currentTextIndex].charAt(charIndex);
        charIndex++;
        setTimeout(autoWrite, delay);
      } else {
        setTimeout(() => {
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          charIndex = 0;
          targetElement.innerHTML = "";
          setTimeout(autoWrite, delay);
        }, pauseBetweenTexts);
      }
    }

    autoWrite();
  }
})();
