const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

let width = 0;
let height = 0;

// Screen size ke hisaab se canvas ko adjust karne ka logic
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Toggle button code 
let currentMode = "pointer";
const toggleBtn = document.getElementById("modeToggle");
const instructionText = document.getElementById("instructionText");

toggleBtn.addEventListener("click", () => {
    if (currentMode === "pointer") {
        currentMode = "skyshot";
        toggleBtn.textContent = "Switch to Pointer Mode";
        instructionText.textContent = "TAP ANYWHERE YOU WANT TO SEE MAGIC";
    } else {
        currentMode = "pointer";
        toggleBtn.textContent = "Switch to Sky short Mode";
        instructionText.textContent = "MOVE YOUR FINGER AROUND TO SEE COLORS";
    } 
});
// particle pool creations 
const POOL_SIZE = 1500;
const ROCKET_POOL_SIZE = 30;

const particlePool = [];
const rocketPool = [];
const flashes = [];

const TRAIL_ALPHA = 0.16;
const TWO_PI = Math.PI * 2;

const random = (min, max) => Math.random() * (max - min) + min;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSkyShotSound(){
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);
    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
}

// Main particle class
class Particle {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 2;
        this.color = "";
        this.opacity = 1;
        this.decay = 0.02;
        this.gravity = 0.06;
        this.friction = 0.98
    }
    spawn (x, y, hue, isSkyShot = false) {
        this.active = true;
        this.x = x;
        this.y = y;
        
        const angle = random(0, TWO_PI);
        const speed = isSkyShot ? random(2, 11) : random(1.5, 7.5);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        if (!isSkyShot) {
            this.vy -= random(0, 1.2);
            this.gravity = 0.055;
            this.friction = 0.98;
            this.size = random(1.2, 2.8);
            this.decay = random(0.015, 0.03);
        } else {
            this.gravity = 0.12;
            this.friction = 0.95;
            this.size = random(1.5, 3.5);
            this.decay = random(0.012, 0.025);
        }
        const finalHue = ((hue + random(-20, 20) + 360) % 360) | 0; 
        const lightness = random(55, 75) | 0;
        this.color = `hsl(${finalHue}, 100%,${lightness}%)`;

        this.opacity = 1;
    }
    update() {
        this.vx *= this.friction
        this.vy *= this.friction
        this.vy += this.gravity

        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;

        if (this.opacity <= 0 || this.x < -100 || this.x > width + 100 || this.y > height + 100) {
            this.active = false;
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TWO_PI);
        ctx.fill();
    }
}

class Rocket {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.hue = 0;
        this.color = "";
    }
    spawn(targetX) {
        this.active = true;
        this.x = targetX;
        this.y = height - 60;
        this.vx = random(-1.5, 1.5);
        this.vy = random(-14, -17);
        this.hue = random(0, 360) | 0;
        this.color = `hsl(${this.hue}, 100%, 70%)`;
    }
    update() {
        this.vy += 0.2;
        this.x += this.vx;
        this.y += this.vy;
        if (this.vy >= -2 || this.y <= 100) {
            this.active = false;
            triggerBurst(this.x, this.y,  110, true, this.hue); ////////
            playSkyShotSound();
        }
    }
    draw() {
        ctx.globalAlpha = 1;  
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, TWO_PI);
        ctx.fill();
    }
}
for (let i = 0; i < POOL_SIZE; i++) {
    particlePool.push(new Particle());
}
for (let i = 0; i < ROCKET_POOL_SIZE; i++) {
    rocketPool.push(new Rocket());
}
// pooling indexes
let poolIndex = 0;
function triggerBurst(x, y, count, isSkyShot = false, customHue = null) {
    const hue = customHue !== null ? customHue : (random(0, 360) | 0);
    let spawned = 0;
    for (let i = 0; i < POOL_SIZE; i++) {
        const idx = (poolIndex + i) % POOL_SIZE;
        const p = particlePool[idx];

        if (!p.active) {
            p.spawn(x, y, hue, isSkyShot);
            spawned++;
            if (spawned >= count) {
                poolIndex = (idx + 1) % POOL_SIZE;
                break;
            }
        }
    }
    
    if (flashes.length < 10) {
        flashes.push({
            x, y, radius: 2, maxRadius: isSkyShot ? random(28, 45) : random(16, 30),
            alpha: 0.85,
            color: `hsl(${hue}, 100%, 75%)`
        });
    }
}
function launchRocket(targetX) {
    for (let i = 0; i < ROCKET_POOL_SIZE; i++) {
        if (!rocketPool[i].active) {
            rocketPool[i].spawn(targetX);
            break;
        }
    }
}
function updateFlashes() {
    ctx.lineWidth = 2;
    for (let i = flashes.length -1; i >= 0; i--) {
        const flash = flashes[i];
        flash.radius += 2.5;
        flash.alpha -= 0.085;
        if (flash.alpha <= 0 || flash.radius >= flash.maxRadius) {
            flashes.splice(i, 1);
            continue;
        }
        ctx.globalAlpha = flash.alpha;
        ctx.strokeStyle = flash.color;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius, 0, TWO_PI);
        ctx.stroke()
    }
}
let lastX = 0;
let lastY = 0;
let lastBurstTime = 0;

const MIN_POINTER_DISTANCE = 12;
const BURST_INTERVAL = 32;

canvas.addEventListener("pointermove", (event) => {
    if (currentMode !== "pointer") return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    const now = performance.now();

    
    if (now - lastBurstTime >= BURST_INTERVAL) {
        if (Math.hypot(dx, dy) >= MIN_POINTER_DISTANCE) {
            triggerBurst(event.clientX, event.clientY, 45, false);
            lastBurstTime = now;
            lastX = event.clientX;
            lastY = event.clientY;
        }
    }
});
canvas.addEventListener("pointerdown", (event) => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    if (event.target.closest("button") || event.target.closest(".theme-picker")) return;

    if (currentMode === "skyshot") {
        launchRocket(event.clientX);
    } else {
        triggerBurst(event.clientX, event.clientY, 100, false);
    }
});
let lastScrollTime = 0;
window.addEventListener("wheel", (event) => {
    const now = performance.now();
    if (now - lastScrollTime > 120) {  
        if (currentMode === "skyshot") {
            launchRocket(random(width * 0.15, width * 0.85));
        } else {
            triggerBurst(event.clientX || width / 2, event.clientY || height / 2, 60, false);
        }
        lastScrollTime = now;
    }
}, { passive: true });
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

let animationId = 0;
function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = TRAIL_ALPHA;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height); 
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < POOL_SIZE; i++) {
        const p = particlePool[i];
        if (!p.active) continue;
        p.update();
        if (p.active) {
        p.draw();
    }
}
for (let i = 0; i < ROCKET_POOL_SIZE; i++) {
        const r = rocketPool[i];
        if (!r.active) continue;

        r.update();
        if (r.active) {
            r.draw();
        }
    }
    updateFlashes();
}
animationId = requestAnimationFrame(animate);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animationId = requestAnimationFrame(animate);
    }
});
// theme toggle code start ffrom here 
const themeButton = document.getElementById("themeButton");
const themeOptions = document.getElementById("themeOptions");
const themeOptionBtns = document.querySelectorAll(".theme-option");

themeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    themeOptions.classList.toggle("open");
});
themeOptionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedImage = btn.getAttribute("data-image");
        if(selectedImage === "none") {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "#000000";
        } else {
            document.body.style.backgroundImage = `url("${selectedImage}")`;
        }
        themeOptions.classList.remove("open");
    });
});