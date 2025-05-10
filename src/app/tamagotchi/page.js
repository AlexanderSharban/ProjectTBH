"use client";
import { useRef, useEffect } from "react";

export default function DoomSimulator() {
  const canvasRef = useRef(null);
  const gameState = useRef({
    health: 100,
    ammo: 50,
    score: 0,
  });
  const enemies = useRef([]);
  const bullets = useRef([]);
  const lastFrameTime = useRef(0);
  const keys = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 320;
    canvas.height = 200;

    const player = {
      x: 2,
      y: 2,
      angle: 0,
      speed: 0.05,
    };

    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    const castRays = () => {
      // Очищаем canvas
      ctx.fillStyle = "#1A2333"; // Темно-синий фон
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем пол (более темный синий)
      ctx.fillStyle = "#0D1426";
      ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

      const FOV = Math.PI / 3; // 60 градусов
      const numRays = canvas.width;
      
      for (let i = 0; i < numRays; i++) {
        const rayAngle = player.angle - FOV/2 + (i/numRays) * FOV;
        
        // DDA алгоритм
        let rayX = player.x;
        let rayY = player.y;
        let mapX = Math.floor(rayX);
        let mapY = Math.floor(rayY);
        
        const rayDirX = Math.cos(rayAngle);
        const rayDirY = Math.sin(rayAngle);
        
        let sideDistX, sideDistY;
        let deltaDistX = Math.abs(1 / rayDirX);
        let deltaDistY = Math.abs(1 / rayDirY);
        let stepX, stepY;
        
        let hit = 0;
        let side;
        
        if (rayDirX < 0) {
          stepX = -1;
          sideDistX = (player.x - mapX) * deltaDistX;
        } else {
          stepX = 1;
          sideDistX = (mapX + 1.0 - player.x) * deltaDistX;
        }
        
        if (rayDirY < 0) {
          stepY = -1;
          sideDistY = (player.y - mapY) * deltaDistY;
        } else {
          stepY = 1;
          sideDistY = (mapY + 1.0 - player.y) * deltaDistY;
        }
        
        // Ищем пересечение со стеной
        while (hit === 0) {
          if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
          } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
          }
          
          if (mapX < 0 || mapY < 0 || mapX >= map[0].length || mapY >= map.length) {
            hit = 1;
          } else if (map[mapY][mapX] === 1) {
            hit = 1;
          }
        }
        
        // Рассчитываем расстояние до стены
        let wallDist;
        if (side === 0) {
          wallDist = (mapX - player.x + (1 - stepX) / 2) / rayDirX;
        } else {
          wallDist = (mapY - player.y + (1 - stepY) / 2) / rayDirY;
        }
        
        // Корректируем расстояние (убираем "рыбий глаз")
        const correctedDist = wallDist * Math.cos(player.angle - rayAngle);
        
        // Вычисляем высоту стены
        const lineHeight = Math.floor(canvas.height / correctedDist);
        const drawStart = Math.max(0, -lineHeight/2 + canvas.height/2);
        const drawEnd = Math.min(canvas.height-1, lineHeight/2 + canvas.height/2);
        
        // Цвет стены с учетом расстояния (чем дальше - тем темнее)
        const wallShade = Math.min(1, 1.5 / correctedDist);
        const wallColor = `rgb(0, ${Math.floor(100 * wallShade)}, ${Math.floor(200 * wallShade)})`;
        const borderColor = "#39FF14"; // Ярко-зеленый
        
        // Рисуем стену с зелеными границами
        ctx.fillStyle = wallColor;
        ctx.fillRect(i, drawStart, 1, drawEnd - drawStart);
        
        // Рисуем границы
        ctx.fillStyle = borderColor;
        ctx.fillRect(i, drawStart, 1, 1); // Верхняя граница
        ctx.fillRect(i, drawEnd - 1, 1, 1); // Нижняя граница
      }
    };

    const drawHUD = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      
      ctx.font = "14px 'Courier New'";
      ctx.fillStyle = "#39FF14";
      ctx.fillText(`HEALTH: ${gameState.current.health}`, 10, canvas.height - 15);
      ctx.fillText(`AMMO: ${gameState.current.ammo}`, 150, canvas.height - 15);
    };

    const gameLoop = (timestamp) => {
      if (timestamp - lastFrameTime.current < 33) { // ~30 FPS
        requestAnimationFrame(gameLoop);
        return;
      }
      lastFrameTime.current = timestamp;

      // Управление
      if (keys.current.ArrowUp) {
        const moveX = player.x + Math.cos(player.angle) * player.speed;
        const moveY = player.y + Math.sin(player.angle) * player.speed;
        if (map[Math.floor(moveY)][Math.floor(moveX)] === 0) {
          player.x = moveX;
          player.y = moveY;
        }
      }
      if (keys.current.ArrowDown) {
        const moveX = player.x - Math.cos(player.angle) * player.speed;
        const moveY = player.y - Math.sin(player.angle) * player.speed;
        if (map[Math.floor(moveY)][Math.floor(moveX)] === 0) {
          player.x = moveX;
          player.y = moveY;
        }
      }
      if (keys.current.ArrowLeft) player.angle -= 0.05;
      if (keys.current.ArrowRight) player.angle += 0.05;

      castRays();
      drawHUD();
      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === " ") { // Стрельба
        if (gameState.current.ammo > 0) {
          gameState.current.ammo--;
          bullets.current.push({
            x: player.x,
            y: player.y,
            angle: player.angle,
            speed: 0.2
          });
        }
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const frameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000"
    }}>
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #39FF14",
          imageRendering: "pixelated",
          width: "640px",
          height: "400px"
        }}
      />
    </div>
  );
}