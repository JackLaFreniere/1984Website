const page = document.body.dataset.page || "home";

function setActiveTopic() {
  const links = document.querySelectorAll("[data-topic]");
  links.forEach((link) => {
    if (link.dataset.topic === page) {
      link.style.borderColor = "var(--accent)";
      link.style.boxShadow = "inset 0 0 0 1px rgba(208, 71, 60, 0.3)";
    }
  });
}

function runReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((block, idx) => {
    block.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
    io.observe(block);
  });
}

function bindCameraEye() {
  const stage = document.querySelector("#watcher-stage");
  const pupil = document.querySelector("#camera-pupil");
  if (!stage || !pupil) return;

  const maxOffset = 16;

  const updateEye = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(maxOffset, Math.hypot(dx, dy) * 0.05);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    pupil.style.transform = `translate(${x}px, ${y}px)`;
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      updateEye(event.clientX, event.clientY);
    },
    { passive: true }
  );

  stage.addEventListener("mouseleave", () => {
    pupil.style.transform = "translate(0, 0)";
  });
}

setActiveTopic();
runReveal();
bindCameraEye();
