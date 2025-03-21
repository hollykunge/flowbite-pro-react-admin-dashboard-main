import { FC, useEffect, useRef, memo } from "react";

interface BackgroundCanvasProps {
  isDarkMode?: boolean;
}

const BackgroundCanvas: FC<BackgroundCanvasProps> = memo(
  ({ isDarkMode = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 霓虹线条的样式 - 简化为只有两条
    const neonLines = [
      // 蓝色曲线
      {
        color: "#3b82f6",
        width: 8,
        type: "blue",
        opacity: 0.7,
      }, // 蓝色

      // 紫色曲线
      {
        color: "#a855f7",
        width: 8,
        type: "purple",
        opacity: 0.7,
      }, // 紫色
    ];

    const gradientStyle = {
      background:
        "radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.25) 20%, rgba(59, 130, 246, 0.15) 40%, rgba(255, 255, 255, 0) 70%)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -20,
    } as React.CSSProperties;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drawBackground();
        }
      };

      const drawBackground = () => {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 创建径向渐变，从右下角开始
        const gradient = ctx.createRadialGradient(
          canvas.width,
          canvas.height,
          0,
          canvas.width,
          canvas.height,
          canvas.width * 0.6,
        );

        gradient.addColorStop(0, "rgba(79, 70, 229, 0.25)"); // 靛蓝色
        gradient.addColorStop(0.3, "rgba(139, 92, 246, 0.2)"); // 紫色
        gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.15)"); // 蓝色
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 添加光晕效果
        const glow = ctx.createRadialGradient(
          canvas.width,
          canvas.height,
          0,
          canvas.width,
          canvas.height,
          canvas.width * 0.4,
        );

        glow.addColorStop(0, "rgba(139, 92, 246, 0.25)"); // 半透明紫色
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制全屏蓝色网格线
        const gridSize = 40; // 网格大小
        const gridColor = isDarkMode
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(59, 130, 246, 0.07)"; // 蓝色网格线

        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor;

        // 水平网格线
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // 垂直网格线
        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // 绘制两条固定的霓虹线条
        neonLines.forEach((line) => {
          // 创建霓虹线条路径
          ctx.beginPath();

          // 设置线条样式
          ctx.lineWidth = line.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // 创建霓虹发光效果
          ctx.shadowBlur = 30;
          ctx.shadowColor = line.color;

          // 设置线条颜色
          const rgbaColor = hexToRgba(line.color, line.opacity);
          ctx.strokeStyle = rgbaColor;

          // 从屏幕右边中间进入
          const entryX = canvas.width;
          // 根据线条类型设置不同的Y轴位置，使两种曲线平行
          const entryY =
            line.type === "blue"
              ? canvas.height * 0.45 // 蓝色线条从右侧偏上进入
              : canvas.height * 0.55; // 紫色线条从右侧偏下进入

          // 从底部中间出去
          const exitX = canvas.width * 0.5; // 底部中间
          const exitY = canvas.height;

          // 绘制起点
          ctx.moveTo(entryX, entryY);

          // 使用cubic-bezier(0.83, 0.42, 0.00, 0.93)参数的三次贝塞尔曲线
          // 将参数映射到画布坐标系
          const x1 = entryX - 0.83 * (entryX - exitX); // 0.83
          const y1 = entryY + 0.42 * (exitY - entryY); // 0.42
          const x2 = entryX - 1.0 * (entryX - exitX); // 1.00 (等于exitX)
          const y2 = entryY + 0.93 * (exitY - entryY); // 0.93

          ctx.bezierCurveTo(
            x1, // 第一控制点x
            y1, // 第一控制点y
            x2, // 第二控制点x
            y2, // 第二控制点y
            exitX,
            exitY, // 终点
          );

          ctx.stroke();

          // 重置阴影效果
          ctx.shadowBlur = 0;
        });
      };

      // 将十六进制颜色转换为rgba格式
      const hexToRgba = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }, [isDarkMode]);

    return (
      <>
        <div style={gradientStyle} />
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full -z-10"
        />
      </>
    );
  },
);

BackgroundCanvas.displayName = "BackgroundCanvas";

export default BackgroundCanvas;
