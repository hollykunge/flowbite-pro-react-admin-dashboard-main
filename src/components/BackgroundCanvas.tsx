import { FC, useEffect, useRef, memo } from "react";

interface BackgroundCanvasProps {
  isDarkMode?: boolean;
}

const BackgroundCanvas: FC<BackgroundCanvasProps> = memo(
  ({ isDarkMode = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const particlesRef = useRef<Particle[]>([]);

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      shape: "circle" | "square" | "triangle";

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.shape = "circle";

        if (isDarkMode) {
          const colorIntensity = Math.floor(Math.random() * 100 + 155);
          const distanceFromCenter = Math.sqrt(
            Math.pow(this.x - canvas.width / 2, 2) +
              Math.pow(this.y - canvas.height / 2, 2),
          );
          const distanceRatio = distanceFromCenter / (canvas.width * 0.4);

          if (distanceRatio < 0.3) {
            this.color = `rgba(${colorIntensity - 100}, ${colorIntensity - 150}, ${colorIntensity}, ${0.8 - distanceRatio})`;
          } else if (distanceRatio < 0.6) {
            this.color = `rgba(${colorIntensity - 50}, ${colorIntensity - 150}, ${colorIntensity}, ${0.7 - distanceRatio * 0.5})`;
          } else {
            this.color = `rgba(${colorIntensity}, ${colorIntensity}, ${colorIntensity}, ${0.6 - distanceRatio * 0.3})`;
          }

          const angle = Math.atan2(
            canvas.height / 2 - this.y,
            canvas.width / 2 - this.x,
          );
          const speed = 0.2 + Math.random() * 0.3;
          this.speedX = Math.cos(angle) * speed;
          this.speedY = Math.sin(angle) * speed;
        } else {
          const blueShade = Math.floor(Math.random() * 50) + 200;
          this.color = `rgba(0, ${blueShade}, 255, ${Math.random() * 0.5 + 0.3})`;
          this.speedX = (Math.random() - 0.5) * 1.5;
          this.speedY = (Math.random() - 0.5) * 1.5;
        }

        this.opacity = Math.random() * 0.5 + 0.3;
        const shapes: Array<"circle" | "square" | "triangle"> = [
          "circle",
          "circle",
          "square",
          "triangle",
          "triangle",
        ];
        this.shape =
          shapes[Math.floor(Math.random() * shapes.length)] || "circle";
      }

      update(canvas: HTMLCanvasElement) {
        if (isDarkMode) {
          this.x += this.speedX;
          this.y += this.speedY;

          const distanceFromCenter = Math.sqrt(
            Math.pow(this.x - canvas.width / 2, 2) +
              Math.pow(this.y - canvas.height / 2, 2),
          );

          if (distanceFromCenter < 20) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.max(canvas.width, canvas.height) * 0.5;
            this.x = canvas.width / 2 + Math.cos(angle) * distance;
            this.y = canvas.height / 2 + Math.sin(angle) * distance;

            const newAngle = Math.atan2(
              canvas.height / 2 - this.y,
              canvas.width / 2 - this.x,
            );
            const speed = 0.2 + Math.random() * 0.3;
            this.speedX = Math.cos(newAngle) * speed;
            this.speedY = Math.sin(newAngle) * speed;
          }
        } else {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
          if (this.y < 0) this.y = canvas.height;
          if (this.y > canvas.height) this.y = 0;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;

        if (this.shape === "circle") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else if (this.shape === "square") {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2,
          );
        } else if (this.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          initParticles();
        }
      };

      const initParticles = () => {
        if (!canvas) return;
        const particleCount = Math.min(
          150,
          Math.floor((canvas.width * canvas.height) / 10000),
        );
        particlesRef.current = Array.from(
          { length: particleCount },
          () => new Particle(canvas),
        );
      };

      const drawTechBackground = () => {
        if (!ctx || !canvas) return;

        if (!isDarkMode) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const gridSize = 50;
          ctx.strokeStyle = "rgba(0, 150, 255, 0.3)";
          ctx.lineWidth = 0.8;

          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }

          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }

          ctx.fillStyle = "rgba(0, 150, 255, 0.4)";
          for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
              ctx.beginPath();
              ctx.arc(x, y, 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      };

      const animate = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTechBackground();

        particlesRef.current.forEach((particle) => {
          particle.update(canvas);
          particle.draw(ctx);
        });

        if (!isDarkMode) {
          ctx.strokeStyle = "rgba(0, 150, 255, 0.15)";
          ctx.lineWidth = 0.3;

          for (let i = 0; i < particlesRef.current.length; i++) {
            for (let j = i + 1; j < particlesRef.current.length; j++) {
              const p1 = particlesRef.current[i];
              const p2 = particlesRef.current[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.3;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                if (distance < 100) {
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const glowSize = (1 - distance / 100) * 1.5;
                  ctx.beginPath();
                  ctx.arc(midX, midY, glowSize, 0, Math.PI * 2);
                  ctx.fillStyle = "rgba(0, 150, 255, 0.3)";
                  ctx.fill();
                }
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isDarkMode]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />
    );
  },
);

BackgroundCanvas.displayName = "BackgroundCanvas";

export default BackgroundCanvas;
