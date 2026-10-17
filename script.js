const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d",{ alpha: false});
 
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRation);
    ctx.setTransform( pixelRatio, 0,
        0, pixelRatio, 0, 0
    );
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const particles =[];
const MAX_PARTICLES = 5000;
const PARTICLES_PER_BRUST = 85;
const GRAVITY = 0.055;
const FRICTION = 0.985;
const AIR_RESISTANCE = 0.998;
const TRAIL_ALPHA = 0.13;

function random(min, max){
    return Math.random() * (max-min) + min;
}

class Particle{
    constructor(x, y, hue){
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1.5, 8.5);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.vy -= random(0, 1.5);
        this.hue = (hue + random(-22, 22) +360) % 360;
        this.saturation = random(80, 100);
        this.lightness = random(55, 75);
        this.opacity = 1;
        this.decay = random(0.009, 0.023);
        this.size = random(1, 3.2);
        this.glow = random(4,13);
        this.dead = false;
    }
    update(){
        this.vx *= AIR_RESISTANCE;
        this.vy *= AIR_RESISTANCE;
        this.vy *= FRICTION;
        this.vy +=GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
        if(
            this.opacity <= 0 ||
            this.x < -100||
            this.x > width + 100 ||
            this.y > height + 100
        ){
            this.dead = true;
        }
    }
    draw(){
        if (this.dead || this.opacity <= 0) return;
        const alpha = Math.ax(0, this.opacity);
        const color =
            `hsla(${this.hue}, ${this.saturation}%, ` +
            `${this.lightness}%, ${alpha})`;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle= color;
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = color;
            ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}

function createBurst(x, y, count = PARTICLES_PER_BURST) {
    const available = MAX_PARTICLES - particles.length;
    const actualCount = Math.min(count, available);

    if (actualCount <= 0) return;
    const hue = random(0, 360);

    for (let i = 0; i < actualCount; i++) {
        particles.push(new Particle(x, y, hue));
    }
    flashes.push({x,y, radius:2, maxRadius: random(18,35),
    alpha: 0.9, hue});

    }
const flashes = [];
function updateFlashes(){
    for (let i = flashes.length -1; i >= 0; i--)
    { const flash = flashes{i};
flash.radius += 2.5;
flash.alpha -= 0.085;
if ( flash.alpha <=0 ||
    flash.radius >= flash.maxRadius
){}
}
}