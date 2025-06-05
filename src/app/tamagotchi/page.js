"use client";
import { useRef, useEffect } from "react";
import Head from "next/head";

export default function DoomSimulator() {
  const canvasRef = useRef(null);
  const gameState = useRef({
    health: 100,
    ammo: 50,
    score: 0,
    gameOver: false,
  });
  const enemies = useRef([]);
  const particles = useRef([]);
  const lastFrameTime = useRef(0);
  const lastShotTime = useRef(0);
  const lastEnemySpawnTime = useRef(0);
  const keys = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    const FOV = Math.PI / 3;
    const HALF_FOV = FOV / 2;

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

    const canMoveTo = (x, y) => {
      const mapX = Math.floor(x);
      const mapY = Math.floor(y);
      return mapY >= 0 && mapY < map.length && 
             mapX >= 0 && mapX < map[0].length && 
             map[mapY][mapX] === 0;
    };

    const hasLineOfSight = (x1, y1, x2, y2) => {
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = (x1 < x2) ? 1 : -1;
      const sy = (y1 < y2) ? 1 : -1;
      let err = dx - dy;
      
      while (true) {
        const mapX = Math.floor(x1);
        const mapY = Math.floor(y1);
        
        if (mapX === Math.floor(x2) && mapY === Math.floor(y2)) {
          return true;
        }
        
        if (map[mapY][mapX] === 1) {
          return false;
        }
        
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
      }
    };

    const spawnEnemy = () => {
      const now = Date.now();
      if (now - lastEnemySpawnTime.current > 3000 && enemies.current.length < 5 && !gameState.current.gameOver) {
        lastEnemySpawnTime.current = now;
        
        let x, y, attempts = 0;
        do {
          x = Math.floor(Math.random() * (map[0].length - 2)) + 1;
          y = Math.floor(Math.random() * (map.length - 2)) + 1;
          attempts++;
        } while ((map[y][x] !== 0 || 
                 Math.sqrt((x - player.x)**2 + (y - player.y)**2) < 4 ||
                 !hasLineOfSight(x + 0.5, y + 0.5, player.x, player.y)) && 
                 attempts < 100);

        if (map[y][x] === 0) {
          enemies.current.push({
            x: x + 0.5,
            y: y + 0.5,
            size: 0.5,
            speed: 0.015,
            health: 3,
            path: [],
            lastPathUpdate: 0,
          });
        }
      }
    };

    const findPath = (startX, startY, targetX, targetY) => {
      const path = [];
      let currentX = Math.floor(startX);
      let currentY = Math.floor(startY);
      const targetCellX = Math.floor(targetX);
      const targetCellY = Math.floor(targetY);
      
      while (currentX !== targetCellX || currentY !== targetCellY) {
        const dx = targetCellX - currentX;
        const dy = targetCellY - currentY;
        
        if (dx !== 0 && dy !== 0) {
          const nextX = currentX + (dx > 0 ? 1 : -1);
          const nextY = currentY + (dy > 0 ? 1 : -1);
          if (map[nextY][nextX] === 0) {
            currentX = nextX;
            currentY = nextY;
            path.push({x: currentX + 0.5, y: currentY + 0.5});
            continue;
          }
        }
        
        if (Math.abs(dx) > Math.abs(dy)) {
          const nextX = currentX + (dx > 0 ? 1 : -1);
          if (map[currentY][nextX] === 0) {
            currentX = nextX;
            path.push({x: currentX + 0.5, y: currentY + 0.5});
          } else {
            const nextY = currentY + (dy > 0 ? 1 : -1);
            if (map[nextY][currentX] === 0) {
              currentY = nextY;
              path.push({x: currentX + 0.5, y: currentY + 0.5});
            }
          }
        } else {
          const nextY = currentY + (dy > 0 ? 1 : -1);
          if (map[nextY][currentX] === 0) {
            currentY = nextY;
            path.push({x: currentX + 0.5, y: currentY + 0.5});
          } else {
            const nextX = currentX + (dx > 0 ? 1 : -1);
            if (map[currentY][nextX] === 0) {
              currentX = nextX;
              path.push({x: currentX + 0.5, y: currentY + 0.5});
            }
          }
        }
        
        if (path.length > 50) break;
      }
      
      return path;
    };

    const castRays = () => {
      ctx.fillStyle = "#1A2333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#0D1426";
      ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

      for (let i = 0; i < canvas.width; i++) {
        const rayAngle = player.angle - HALF_FOV + (i/canvas.width) * FOV;
        
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
          
          if (mapX < 0 || mapY < 0 || mapX >= map[0].length || mapY >= map.length || map[mapY][mapX] === 1) {
            hit = 1;
          }
        }
        
        let wallDist = side === 0 
          ? (mapX - player.x + (1 - stepX)/2) / rayDirX 
          : (mapY - player.y + (1 - stepY)/2) / rayDirY;
        
        const correctedDist = wallDist * Math.cos(player.angle - rayAngle);
        const lineHeight = Math.floor(canvas.height / correctedDist);
        const drawStart = Math.max(0, -lineHeight/2 + canvas.height/2);
        const drawEnd = Math.min(canvas.height-1, lineHeight/2 + canvas.height/2);
        
        const wallShade = Math.min(1, 1.5 / correctedDist);
        ctx.fillStyle = `rgb(0, ${Math.floor(100 * wallShade)}, ${Math.floor(200 * wallShade)})`;
        ctx.fillRect(i, drawStart, 1, drawEnd - drawStart);
        
        ctx.fillStyle = "#39FF14";
        ctx.fillRect(i, drawStart, 1, 1);
        ctx.fillRect(i, drawEnd - 1, 1, 1);
      }
    };

    const isEnemyInCrosshair = (enemy) => {
      const relX = enemy.x - player.x;
      const relY = enemy.y - player.y;
      const rotatedX = relX * Math.cos(-player.angle) - relY * Math.sin(-player.angle);
      const rotatedY = relX * Math.sin(-player.angle) + relY * Math.cos(-player.angle);
      
      if (rotatedX <= 0) return false;
      
      const screenX = canvas.width / 2 + rotatedY / rotatedX * (canvas.width / 2 / Math.tan(HALF_FOV));
      const screenY = canvas.height / 2;
      const crosshairX = canvas.width / 2;
      const crosshairY = canvas.height / 2;
      
      const baseSize = 30;
      const enemySize = Math.min(
        baseSize * 2,
        Math.max(
          5,
          baseSize / rotatedX * enemy.size
        )
      );
      
      const hitboxRadius = enemySize / 2;
      const distance = Math.sqrt((screenX - crosshairX) ** 2 + (screenY - crosshairY) ** 2);
      return distance < hitboxRadius && hasLineOfSight(player.x, player.y, enemy.x, enemy.y);
    };

    const spawnParticles = (screenX, screenY, type, count = 5) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        particles.current.push({
          x: screenX,
          y: screenY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          type: type,
        });
      }
    };

    const updateParticles = () => {
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        p.vy += 0.1;
      });
    };

    const drawParticles = () => {
      particles.current.forEach(p => {
        ctx.globalAlpha = p.life;
        if (p.type === "blood") {
          ctx.fillStyle = "#FF69B4";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "explosion") {
          ctx.fillStyle = "#FF0000";
          ctx.fillRect(p.x, p.y, 3, 3);
        }
        ctx.globalAlpha = 1.0;
      });
    };

    const explodeEnemy = (enemy, enemyIndex, screenX, screenY, onContact = false) => {
      spawnParticles(screenX, screenY, "explosion", 10);
      if (onContact) {
        gameState.current.health -= 10;
      } else {
        gameState.current.score += 10;
        gameState.current.ammo += 5;
      }
      enemies.current.splice(enemyIndex, 1);
    };

    const drawEnemies = () => {
      const now = Date.now();
      
      const sortedEnemies = enemies.current.map((enemy, index) => ({
        enemy,
        index,
        dist: Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2)
      })).sort((a, b) => b.dist - a.dist);

      const depthBuffer = new Array(canvas.width).fill(Infinity);

      sortedEnemies.forEach(({ enemy, index }) => {
        if (!hasLineOfSight(player.x, player.y, enemy.x, enemy.y)) {
          return;
        }

        if (now - enemy.lastPathUpdate > 2000) {
          enemy.path = findPath(enemy.x, enemy.y, player.x, player.y);
          enemy.lastPathUpdate = now;
        }

        if (enemy.path.length > 0) {
          const target = enemy.path[0];
          const dx = target.x - enemy.x;
          const dy = target.y - enemy.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 0.1) {
            enemy.path.shift();
          } else {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
          }
        }

        const canSeePlayer = hasLineOfSight(enemy.x, enemy.y, player.x, player.y);
        
        if (canSeePlayer) {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          const minDistance = 0.3;
          if (dist > minDistance) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
          }
        }

        const distToPlayer = Math.sqrt((enemy.x - player.x)**2 + (enemy.y - player.y)**2);
        if (distToPlayer < 0.3) {
          const relX = enemy.x - player.x;
          const relY = enemy.y - player.y;
          const rotatedX = relX * Math.cos(-player.angle) - relY * Math.sin(-player.angle);
          const rotatedY = relX * Math.sin(-player.angle) + relY * Math.cos(-player.angle);
          const screenX = canvas.width/2 + rotatedY/rotatedX * (canvas.width/2 / Math.tan(HALF_FOV));
          const screenY = canvas.height/2;
          explodeEnemy(enemy, index, screenX, screenY, true);
          return;
        }

        const relX = enemy.x - player.x;
        const relY = enemy.y - player.y;
        const rotatedX = relX * Math.cos(-player.angle) - relY * Math.sin(-player.angle);
        const rotatedY = relX * Math.sin(-player.angle) + relY * Math.cos(-player.angle);
        
        if (rotatedX > 0) {
          const screenX = canvas.width/2 + rotatedY/rotatedX * (canvas.width/2 / Math.tan(HALF_FOV));
          const screenY = canvas.height/2;
          
          const baseSize = 30;
          const size = Math.min(
            baseSize * 2,
            Math.max(
              5,
              baseSize / rotatedX * enemy.size
            )
          );

          const startX = Math.max(0, Math.floor(screenX - size));
          const endX = Math.min(canvas.width - 1, Math.floor(screenX + size));
          let isVisible = false;
          for (let x = startX; x <= endX; x++) {
            const rayAngle = player.angle - HALF_FOV + (x/canvas.width) * FOV;
            const rayDirX = Math.cos(rayAngle);
            const rayDirY = Math.sin(rayAngle);
            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);
            
            let rayX = player.x;
            let rayY = player.y;
            let mapX = Math.floor(rayX);
            let mapY = Math.floor(rayY);
            let sideDistX, sideDistY, stepX, stepY, hit = 0, side;
            
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
              if (mapX < 0 || mapY < 0 || mapX >= map[0].length || mapY >= map.length || map[mapY][mapX] === 1) {
                hit = 1;
              }
            }
            
            const wallDist = side === 0 
              ? (mapX - player.x + (1 - stepX)/2) / rayDirX 
              : (mapY - player.y + (1 - stepY)/2) / rayDirY;
            
            const enemyDist = rotatedX;
            if (enemyDist < wallDist || (enemyDist < depthBuffer[x] + enemy.size)) {
              isVisible = true;
              depthBuffer[x] = Math.min(depthBuffer[x], enemyDist);
            }
          }

          if (isVisible) {
            ctx.fillStyle = "#00B7EB";
            ctx.beginPath();
            ctx.ellipse(screenX, screenY, size/2, size/3, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#00B7EB";
            ctx.beginPath();
            ctx.moveTo(screenX - size/2, screenY - size/3);
            ctx.lineTo(screenX - size/3, screenY - size/2);
            ctx.lineTo(screenX - size/4, screenY - size/3);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(screenX + size/2, screenY - size/3);
            ctx.lineTo(screenX + size/3, screenY - size/2);
            ctx.lineTo(screenX + size/4, screenY - size/3);
            ctx.fill();

            ctx.fillStyle = "#FF69B4";
            ctx.beginPath();
            ctx.arc(screenX - size/4, screenY + size/6, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(screenX + size/4, screenY + size/6, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#00FF00";
            ctx.beginPath();
            ctx.arc(screenX, screenY + size/6, 3, 0, Math.PI, true);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + size/6 + 3);
            ctx.lineTo(screenX, screenY + size/6 + 6);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#00FF00";
            ctx.stroke();

            ctx.fillStyle = "#00FFFF";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size/6, 3, 0, Math.PI * 2);
            ctx.fill();

            if (enemy.health < 3) {
              ctx.fillStyle = "#FF0000";
              ctx.fillRect(screenX - size/2, screenY - size/2 - 5, size * (enemy.health / 3), 2);
            }
          }
        }
      });
    };

    const drawHUD = () => {
      if (gameState.current.gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
        
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#39FF14";
        ctx.fillText(`HEALTH: ${gameState.current.health}`, 10, canvas.height - 15);
        ctx.fillText(`AMMO: ${gameState.current.ammo}`, 120, canvas.height - 15);
        ctx.fillText(`SCORE: ${gameState.current.score}`, 230, canvas.height - 15);
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
        
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#39FF14";
        ctx.fillText(`HEALTH: ${gameState.current.health}`, 10, canvas.height - 15);
        ctx.fillText(`AMMO: ${gameState.current.ammo}`, 120, canvas.height - 15);
        ctx.fillText(`SCORE: ${gameState.current.score}`, 230, canvas.height - 15);
        
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(canvas.width/2 - 5, canvas.height/2, 10, 1);
        ctx.fillRect(canvas.width/2, canvas.height/2 - 5, 1, 10);
      }
    };

    const drawGun = () => {
      if (gameState.current.gameOver) return;
      const gunYOffset = player.isShooting ? Math.sin(player.shootAnimation * 0.5) * 3 : 0;
      const gunY = canvas.height - 50 + gunYOffset;
      
      ctx.fillStyle = "#39FF14";
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 15, gunY);
      ctx.lineTo(canvas.width/2 + 15, gunY);
      ctx.lineTo(canvas.width/2 + 10, gunY - 20);
      ctx.lineTo(canvas.width/2 - 10, gunY - 20);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#00FF00";
      ctx.fillRect(canvas.width/2 - 5, gunY - 25, 10, 5);

      ctx.fillStyle = "#39FF14";
      ctx.fillRect(canvas.width/2 - 10, gunY + 5, 20, 10);

      ctx.strokeStyle = "#FF00FF";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, gunY - 20);
      ctx.lineTo(canvas.width/2, gunY - 30);
      ctx.stroke();

      if (player.isShooting && player.shootAnimation < 0.2) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(canvas.width/2 - 10, gunY - 25, 20, 5);
      }
      
      if (player.isShooting) {
        player.shootAnimation += 0.2;
        if (player.shootAnimation > Math.PI) {
          player.isShooting = false;
          player.shootAnimation = 0;
        }
      }
    };

    const shoot = () => {
      if (gameState.current.gameOver) return;
      const now = Date.now();
      if (now - lastShotTime.current > 300 && gameState.current.ammo > 0 && !gameState.current.gameOver) {
        gameState.current.ammo--;
        lastShotTime.current = now;
        player.isShooting = true;
        player.shootAnimation = 0;
        
        for (let i = enemies.current.length - 1; i >= 0; i--) {
          const enemy = enemies.current[i];
          if (isEnemyInCrosshair(enemy)) {
            enemy.health--;
            const relX = enemy.x - player.x;
            const relY = enemy.y - player.y;
            const rotatedX = relX * Math.cos(-player.angle) - relY * Math.sin(-player.angle);
            const rotatedY = relX * Math.sin(-player.angle) + relY * Math.cos(-player.angle);
            const screenX = canvas.width/2 + rotatedY/rotatedX * (canvas.width/2 / Math.tan(HALF_FOV));
            const screenY = canvas.height/2;
            spawnParticles(screenX, screenY, "blood");
            if (enemy.health <= 0) {
              explodeEnemy(enemy, i, screenX, screenY);
            }
            break;
          }
        }
      }
    };

    const resetGame = () => {
      gameState.current.health = 100;
      gameState.current.ammo = 50;
      gameState.current.score = 0;
      gameState.current.gameOver = false;
      player.x = 2;
      player.y = 2;
      enemies.current = [];
      particles.current = [];
      lastEnemySpawnTime.current = 0;
    };

    const gameLoop = (timestamp) => {
      if (timestamp - lastFrameTime.current < 33) {
        requestAnimationFrame(gameLoop);
        return;
      }
      lastFrameTime.current = timestamp;

      if (gameState.current.health <= 0 && !gameState.current.gameOver) {
        gameState.current.gameOver = true;
      }

      if (gameState.current.gameOver && keys.current.Enter) {
        resetGame();
      }

      if (!gameState.current.gameOver) {
        spawnEnemy();
        updateParticles();

        if (keys.current.ArrowUp) {
          const moveX = player.x + Math.cos(player.angle) * player.speed;
          const moveY = player.y + Math.sin(player.angle) * player.speed;
          if (canMoveTo(moveX, moveY)) {
            player.x = moveX;
            player.y = moveY;
          }
        }
        if (keys.current.ArrowDown) {
          const moveX = player.x - Math.cos(player.angle) * player.speed;
          const moveY = player.y - Math.sin(player.angle) * player.speed;
          if (canMoveTo(moveX, moveY)) {
            player.x = moveX;
            player.y = moveY;
          }
        }
        if (keys.current.ArrowLeft) player.angle -= 0.05;
        if (keys.current.ArrowRight) player.angle += 0.05;
        if (keys.current[" "]) shoot();

        castRays();
        drawEnemies();
        drawParticles();
        drawHUD();
        drawGun();
      } else if (gameState.current.gameOver && !keys.current.Enter) {
        // Exploration mode: only move and render map
        updateParticles();
        if (keys.current.ArrowUp) {
          const moveX = player.x + Math.cos(player.angle) * player.speed;
          const moveY = player.y + Math.sin(player.angle) * player.speed;
          if (canMoveTo(moveX, moveY)) {
            player.x = moveX;
            player.y = moveY;
          }
        }
        if (keys.current.ArrowDown) {
          const moveX = player.x - Math.cos(player.angle) * player.speed;
          const moveY = player.y - Math.sin(player.angle) * player.speed;
          if (canMoveTo(moveX, moveY)) {
            player.x = moveX;
            player.y = moveY;
          }
        }
        if (keys.current.ArrowLeft) player.angle -= 0.05;
        if (keys.current.ArrowRight) player.angle += 0.05;
        castRays();
        drawParticles();
        drawHUD();
      }
      
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
