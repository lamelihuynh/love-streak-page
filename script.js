const canvas = document.querySelector("#sparkle-canvas");
const ctx = canvas.getContext("2d");
const button = document.querySelector("#accept-button");
const panel = document.querySelector("#accepted-panel");
const toast = document.querySelector("#toast");
const reviewBox = document.querySelector("#review-box");
const reviewText = document.querySelector("#review-text");
const dayCount = document.querySelector("#day-count");

const startDate = new Date("2026-07-08T00:00:00+07:00");
const colors = ["#ff7eb6", "#ffb38a", "#c9b8ff", "#a8f0d4", "#fff3a8"];
let sparkles = [];
let width = 0;
let height = 0;
let pixelRatio = 1;

function updateDayCount() {
  const now = new Date();
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = today - start;
  const days = Math.max(1, Math.floor(diff / 86400000) + 1);
  dayCount.textContent = String(days);
}

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createSparkles();
}

function createSparkles() {
  const count = Math.min(70, Math.floor((width * height) / 11000));
  sparkles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 5 + 3,
    speed: Math.random() * 0.45 + 0.18,
    spin: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.5 + 0.35,
  }));
}

function drawStar(x, y, radius, spin) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.beginPath();

  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    const pointRadius = i % 2 === 0 ? radius : radius * 0.38;
    ctx.lineTo(Math.cos(angle) * pointRadius, Math.sin(angle) * pointRadius);
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSparkles() {
  ctx.clearRect(0, 0, width, height);

  sparkles.forEach((sparkle) => {
    sparkle.y -= sparkle.speed;
    sparkle.spin += 0.012;
    sparkle.x += Math.sin(sparkle.y * 0.01) * 0.16;

    if (sparkle.y < -12) {
      sparkle.y = height + 12;
      sparkle.x = Math.random() * width;
    }

    ctx.globalAlpha = sparkle.alpha;
    ctx.fillStyle = sparkle.color;
    drawStar(sparkle.x, sparkle.y, sparkle.size, sparkle.spin);
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawSparkles);
}

function createFloatingHearts() {
  const rect = button.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let i = 0; i < 28; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = i % 3 === 0 ? "♡" : "♥";
    heart.style.left = `${startX + (Math.random() - 0.5) * 150}px`;
    heart.style.top = `${startY + (Math.random() - 0.5) * 28}px`;
    heart.style.color = colors[i % colors.length];
    heart.style.setProperty("--x", `${(Math.random() - 0.5) * 190}px`);
    heart.style.setProperty("--r", `${Math.random() * 90 - 45}deg`);
    heart.style.animationDelay = `${Math.random() * 0.26}s`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 2100);
  }
}

function acceptStreak() {
  button.disabled = true;
  button.textContent = "Anh chấp nhận rồi";
  reviewBox.classList.add("is-accepted");
  reviewText.textContent = "chấp nhận yêu cầu bắt đầu chuỗi";
  panel.classList.add("is-open");
  toast.classList.add("is-visible");
  createFloatingHearts();

  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

window.addEventListener("resize", resizeCanvas);
button.addEventListener("click", acceptStreak);

updateDayCount();
resizeCanvas();
drawSparkles();
