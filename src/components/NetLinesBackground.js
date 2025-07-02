// src/components/NetLinesBackground.js
export function startNetLinesCanvas() {
  const canvas = document.getElementById("net-lines-bg");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const lines = Array.from({ length: 20 }, () => createLine());

  function createLine() {
    return {
      points: Array.from({ length: 8 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      })),
      hue: 270 + Math.random() * 40, // purple-blue hue
    };
  }

  function drawCurve(points, hue) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.shadowColor = "rgba(0, 240, 255, 0.6)";

    ctx.shadowBlur = 10;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const line of lines) {
      for (const p of line.points) {
        p.x += p.vx;
        p.y += p.vy;

        // bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      drawCurve(line.points, line.hue);
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}
