class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 10 + 5;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
      this.color = `rgba(32, 128, 255, ${Math.random() * 0.5 + 0.2})`;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < this.radius || this.x > window.innerWidth - this.radius) {
        this.vx *= -1;
      }
      if (this.y < this.radius || this.y > window.innerHeight - this.radius) {
        this.vy *= -1;
      }
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  class LiquidEffect {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.zIndex = '-1';
      this.canvas.style.pointerEvents = 'none';
      document.body.appendChild(this.canvas);
      
      // Create particles
      this.particles = [];
      for (let i = 0; i < 50; i++) {
        this.particles.push(
          new Particle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight
          )
        );
      }
      
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }
    
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw connections between nearby particles
      this.ctx.beginPath();
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          }
        }
      }
      this.ctx.strokeStyle = 'rgba(32, 128, 255, 0.1)';
      this.ctx.stroke();
      
      // Update and draw particles
      for (const particle of this.particles) {
        particle.update();
        particle.draw(this.ctx);
      }
      
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // Initialize the effect when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new LiquidEffect();
  });