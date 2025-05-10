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
  const lastShotTime = useRef(0);
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
      isShooting: false,
      shootAnimation: 0,
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
      ctx.fillStyle = "#1A2333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#0D1426";
      ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

      const FOV = Math.PI / 3;
      const numRays = canvas.width;
      
      for (let i = 0; i < numRays; i++) {
        const rayAngle = player.angle - FOV/2 + (i/numRays) * FOV;
        
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
        
        let wallDist;
        if (side === 0) {
          wallDist = (mapX - player.x + (1 - stepX) / 2) / rayDirX;
        } else {
          wallDist = (mapY - player.y + (1 - stepY) / 2) / rayDirY;
        }
        
        const correctedDist = wallDist * Math.cos(player.angle - rayAngle);
        const lineHeight = Math.floor(canvas.height / correctedDist);
        const drawStart = Math.max(0, -lineHeight/2 + canvas.height/2);
        const drawEnd = Math.min(canvas.height-1, lineHeight/2 + canvas.height/2);
        
        const wallShade = Math.min(1, 1.5 / correctedDist);
        const wallColor = `rgb(0, ${Math.floor(100 * wallShade)}, ${Math.floor(200 * wallShade)})`;
        const borderColor = "#39FF14";
        
        ctx.fillStyle = wallColor;
        ctx.fillRect(i, drawStart, 1, drawEnd - drawStart);
        
        ctx.fillStyle = borderColor;
        ctx.fillRect(i, drawStart, 1, 1);
        ctx.fillRect(i, drawEnd - 1, 1, 1);
      }
    };

    const drawHUD = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      
      ctx.font = "14px 'Courier New'";
      ctx.fillStyle = "#39FF14";
      ctx.fillText(`HEALTH: ${gameState.current.health}`, 10, canvas.height - 15);
      ctx.fillText(`AMMO: ${gameState.current.ammo}`, 150, canvas.height - 15);
      
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(canvas.width/2 - 5, canvas.height/2, 10, 1);
      ctx.fillRect(canvas.width/2, canvas.height/2 - 5, 1, 10);
    };

    const drawGun = () => {
      const gunYOffset = player.isShooting ? Math.sin(player.shootAnimation * 0.5) * 3 : 0;
      const gunY = canvas.height - 50 + gunYOffset;
      
      // Цвет пистолета
      ctx.fillStyle = "#39FF14";
      
      // Ручка пистолета (без изменений)
      ctx.fillRect(canvas.width/2 - 12, gunY, 24, 8);
      
      // Утолщенное дуло пистолета (по вашему примеру 01110)
      // Центральная толстая часть (6px)
      ctx.fillRect(canvas.width/2 - 3, gunY - 15, 6, 15);
      // Боковые тонкие части (по 2px)
      ctx.fillRect(canvas.width/2 - 8, gunY - 10, 2, 10);
      ctx.fillRect(canvas.width/2 + 6, gunY - 10, 2, 10);
      
      // Спусковая скоба
      ctx.fillRect(canvas.width/2 - 8, gunY + 8, 16, 2);
      
      // Вспышка выстрела из дула
      if (player.isShooting && player.shootAnimation < 0.2) {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(canvas.width/2, gunY - 15, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (player.isShooting) {
        player.shootAnimation += 0.2;
        if (player.shootAnimation > Math.PI) {
          player.isShooting = false;
          player.shootAnimation = 0;
        }
      }
    };

    const drawBullets = () => {
      bullets.current.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        bullet.distance += bullet.speed;
        
        const mapX = Math.floor(bullet.x);
        const mapY = Math.floor(bullet.y);
        
        if (mapX < 0 || mapX >= map[0].length || 
            mapY < 0 || mapY >= map.length || 
            map[mapY][mapX] === 1 ||
            bullet.distance > 20) {
          bullets.current.splice(index, 1);
          return;
        }
        
        const relX = bullet.x - player.x;
        const relY = bullet.y - player.y;
        
        const rotatedX = relX * Math.cos(-player.angle) - relY * Math.sin(-player.angle);
        const rotatedY = relX * Math.sin(-player.angle) + relY * Math.cos(-player.angle);
        
        if (rotatedX > 0) {
          const screenX = canvas.width/2 + rotatedY/rotatedX * (canvas.width/2 / Math.tan(FOV/2));
          const screenY = canvas.height/2 - 10/rotatedX * (canvas.width/2 / Math.tan(FOV/2));
          
          if (screenX > 0 && screenX < canvas.width && screenY > 0 && screenY < canvas.height) {
            ctx.fillStyle = "#FF0000";
            ctx.beginPath();
            ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    };

    const shoot = () => {
      const now = Date.now();
      if (now - lastShotTime.current > 300 && gameState.current.ammo > 0) {
        gameState.current.ammo--;
        lastShotTime.current = now;
        player.isShooting = true;
        player.shootAnimation = 0;
        
        bullets.current.push({
          x: player.x,
          y: player.y,
          angle: player.angle,
          speed: 0.3,
          distance: 0
        });
      }
    };

    const FOV = Math.PI / 3;

    const gameLoop = (timestamp) => {
      if (timestamp - lastFrameTime.current < 33) {
        requestAnimationFrame(gameLoop);
        return;
      }
      lastFrameTime.current = timestamp;

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
      if (keys.current[" "]) shoot();

      castRays();
      drawBullets();
      drawHUD();
      drawGun();
      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
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