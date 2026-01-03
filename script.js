(async function () {
  // Try to fetch data.json. If unavailable, show error.
  let cfg = null;
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (res.ok) {
      cfg = await res.json();
    } else {
      console.error("Failed to load data.json");
      return;
    }
  } catch (e) {
    console.error("Error loading data.json:", e);
    return;
  }

  // Apply colors
  const root = document.documentElement;
  if (cfg.bgColor) root.style.setProperty("--bg", cfg.bgColor);
  if (cfg.cardColor) root.style.setProperty("--card", cfg.cardColor);
  if (cfg.textColor) root.style.setProperty("--text", cfg.textColor);
  if (cfg.accentColor) root.style.setProperty("--accent", cfg.accentColor);

  // Set page title
  if (cfg.title) {
    document.title = cfg.title;
  }

  // Set Open Graph meta tags for link sharing
  const setMeta = (property, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setMeta('og:title', cfg.title);
  setMeta('og:description', cfg.subtitle);
  setMeta('og:image', cfg.logo);
  setMeta('og:type', 'website');
  setMeta('og:url', window.location.href);

  // Set Twitter meta tags
  const setTwitterMeta = (name, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setTwitterMeta('twitter:card', 'summary_large_image');
  setTwitterMeta('twitter:title', cfg.title);
  setTwitterMeta('twitter:description', cfg.subtitle);
  setTwitterMeta('twitter:image', cfg.logo);

  // Set texts
  document.getElementById("title").textContent = cfg.title || "";
  document.getElementById("subtitle").textContent = cfg.subtitle || "";

  // Logo handling: if logo exists, set src; otherwise hide wrapper
  const logoImg = document.getElementById("logo");
  const logoWrap = document.getElementById("logoWrap");
  if (cfg.logo) {
    logoImg.src = cfg.logo;
    logoImg.alt = cfg.title || "logo";
    // If image fails to load, hide gracefully
    logoImg.addEventListener("error", () => {
      logoWrap.style.display = "none";
    });
  } else {
    logoWrap.style.display = "none";
  }

  // Render links
  const linksEl = document.getElementById("links");
  linksEl.innerHTML = "";

  (cfg.links || []).forEach((item, idx) => {
    const href = item.url || "#";

    const a = document.createElement("a");
    a.className = "card";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";

    const fav = document.createElement("div");
    fav.className = "fav";
    
    // Support image, icon (URL), or iconName (Lucide icon)
    if (item.image) {
      const im = document.createElement("img");
      im.src = item.image;
      im.alt = "";
      fav.appendChild(im);
    } else if (item.icon) {
      const im = document.createElement("img");
      im.src = item.icon;
      im.alt = "";
      fav.appendChild(im);
    } else if (item.iconName) {
      const iconEl = document.createElement("i");
      iconEl.setAttribute("data-lucide", item.iconName);
      fav.appendChild(iconEl);
    }

    const meta = document.createElement("div");
    meta.className = "meta";
    const label = document.createElement("div");
    label.className = "label";
    const num = item.number || idx + 1 + ".";
    label.textContent = `${num} ${item.title || item.name || "Location"}`;
    const sub = document.createElement("div");
    sub.className = "sub";
    if (item.phone) {
      const phoneLink = document.createElement("a");
      phoneLink.href = `tel:${item.phone.replace(/\s+/g, "")}`;
      phoneLink.textContent = item.phone;
      phoneLink.onclick = (e) => e.stopPropagation();
      sub.appendChild(phoneLink);
    } else if (item.address) {
      sub.textContent = item.address;
    } else {
      sub.textContent = item.description || "";
    }

    meta.appendChild(label);
    if (sub.textContent || sub.children.length) meta.appendChild(sub);

    a.appendChild(fav);
    a.appendChild(meta);

    linksEl.appendChild(a);
  });

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Render socials
  const socialsEl = document.getElementById("socials");
  socialsEl.innerHTML = "";
  (cfg.socials || []).forEach((s) => {
    const a = document.createElement("a");
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener";
    if (s.icon) {
      const im = document.createElement("img");
      im.src = s.icon;
      im.alt = s.platform || "social";
      a.appendChild(im);
    } else {
      a.textContent = s.platform || "social";
    }
    socialsEl.appendChild(a);
  });
})();
