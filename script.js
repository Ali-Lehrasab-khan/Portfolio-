const preloader = document.getElementById("preloader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const typedText = document.getElementById("typedText");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const cursorGlow = document.getElementById("cursorGlow");
const profileImage = document.getElementById("profileImage");
const avatarFallback = document.getElementById("avatarFallback");
const emailText = document.getElementById("emailText");
const copyEmail = document.getElementById("copyEmail");

const roles = [
  "Computer Science Student",
  "Python Developer",
  "AI Automation Developer",
  "Web Developer",
  "JavaScript Developer",
  "App Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

window.addEventListener("load", () => {
  setTimeout(() => preloader?.classList.add("hidden"), 450);
});

function typeLoop() {
  const currentRole = roles[roleIndex];
  const nextText = isDeleting
    ? currentRole.slice(0, charIndex - 1)
    : currentRole.slice(0, charIndex + 1);

  typedText.textContent = nextText;
  charIndex = nextText.length;

  if (!isDeleting && nextText === currentRole) {
    setTimeout(() => {
      isDeleting = true;
      typeLoop();
    }, 1400);
    return;
  }

  if (isDeleting && nextText === "") {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeLoop, isDeleting ? 42 : 78);
}

typeLoop();

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const icon = themeToggle.querySelector("i");
  icon.className = document.body.classList.contains("light")
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
});

profileImage?.addEventListener("error", () => {
  profileImage.closest(".profile-frame")?.classList.add("image-missing");
  avatarFallback?.setAttribute("aria-hidden", "false");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 36));

    const tick = () => {
      current = Math.min(target, current + step);
      counter.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };

    tick();
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.65 });

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.style.display = shouldShow ? "" : "none";
    });
  });
});

window.addEventListener("scroll", () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  backToTop?.classList.toggle("visible", window.scrollY > 520);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

copyEmail?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailText.textContent.trim());
    copyEmail.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => {
      copyEmail.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 1300);
  } catch {
    window.location.href = `mailto:${emailText.textContent.trim()}`;
  }
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});
