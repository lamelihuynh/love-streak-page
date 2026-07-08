const canvas = document.querySelector("#sparkle-canvas");
const ctx = canvas.getContext("2d");
const button = document.querySelector("#accept-button");
const panel = document.querySelector("#promise-panel");
const toast = document.querySelector("#toast");
const typingLine = document.querySelector("#typing-line");
const approvedLine = document.querySelector(".approved-line");

const text = "protocol: send_each_other_something_daily = true;";
const colors = ["#ff4f9f", "#ffd166", "#64e3ff", "#72f2a6", "#ff7a8a"];
let particles = [];
let burstParticles = [];
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(90, Math.floor((width * height) / 9000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.9 + 0.6,
    speed: Math.random() * 0.45 + 0.12,
    alpha: Math.random() * 0.6 + 0.25,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function drawSparkles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin((particle.y + particle.radius) * 0.015) * 0.25;

    if (particle.y < -10) {
      particle.y = height + 10;
      particle.x = Math.random() * width;
    }

    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  burstParticles = burstParticles.filter((particle) => particle.life > 0);
  burstParticles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.045;
    particle.life -= 0.018;

    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawSparkles);
}

function typeMessage(index = 0) {
  typingLine.textContent = text.slice(0, index);

  if (index < text.length) {
    window.setTimeout(() => typeMessage(index + 1), 42);
    return;
  }

  window.setTimeout(() => approvedLine.classList.add("is-visible"), 280);
}

function createConfetti() {
  const amount = 52;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${Math.random() * 16 + 6}vh`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 220}px`);
    piece.style.setProperty("--y", `${Math.random() * 420 + 260}px`);
    piece.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.22}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1900);
  }
}

function createHeartBurst() {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 36; i += 1) {
    const angle = (Math.PI * 2 * i) / 36;
    const speed = Math.random() * 3.8 + 2.2;

    burstParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3.5 + 2,
      life: 1,
      color: colors[i % colors.length],
    });
  }
}

function showAcceptance() {
  button.disabled = true;
  button.querySelector("span").textContent = "Accepted & deployed";
  button.querySelector("small").textContent = "chuỗi đã được kích hoạt";
  panel.classList.add("is-open");
  toast.classList.add("is-visible");
  createConfetti();
  createHeartBurst();

  window.setTimeout(() => {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 360);

  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

window.addEventListener("resize", resizeCanvas);
button.addEventListener("click", showAcceptance);

resizeCanvas();
drawSparkles();
typeMessage();
