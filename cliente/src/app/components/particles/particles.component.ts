import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #particleCanvas class="absolute inset-0 w-full h-full"></canvas>
  `,
  styles: [`
    canvas {
      pointer-events: none;
    }
  `]
})
export class ParticlesComponent implements OnInit {
  @ViewChild('particleCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;

  ngOnInit() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.handleResize();
  }

  private initCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private handleResize() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
  }

  private createParticles() {
    this.particles = [];
    const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 8000);
    
    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push(new Particle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }
  }

  private animate() {
    this.ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

class Particle {
  private speed = Math.random() * 0.2 + 0.1;
  private size = Math.random() * 2;
  private brightness = Math.random();
  private angle = Math.random() * Math.PI * 2;

  constructor(
    private x: number,
    private y: number
  ) {}

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Mantener las partículas dentro de la pantalla
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;

    // Efecto de brillo pulsante
    this.brightness = Math.sin(Date.now() * 0.001 + this.x) * 0.3 + 0.7;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.fill();
  }
}
