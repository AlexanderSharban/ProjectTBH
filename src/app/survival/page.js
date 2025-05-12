"use client";

import { useEffect, useRef, useState } from "react";

const TILE_SIZE = 28;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const COLOR = "#00FFAA"; // Зелёный цвет
const BLOCK_SIZE = 2.8;
const GRID_SIZE = Math.floor(TILE_SIZE / BLOCK_SIZE); // 28 / 2.8 = 10

export default function SurvivalGame() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("right");
  const [currentLocation, setCurrentLocation] = useState("forest");
  const [inventory, setInventory] = useState({ wood: 0 }); // Инвентарь
  const [selectedItem, setSelectedItem] = useState(null); // Выбранный предмет (null или "wood")
  const [lastKey, setLastKey] = useState(null); // Последняя нажатая клавиша
  const [health, setHealth] = useState(10); // Здоровье игрока
  const maxHealth = 10; // Максимальное здоровье

  const generateForestMap = () => {
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    // Добавляем реку (вертикальная полоса воды на x=30)
    for (let y = 0; y < MAP_HEIGHT; y++) {
      map[y][30] = 5; // Вода
    }

    let treesPlaced = 0;
    while (treesPlaced < 100) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (map[y][x] === 0 && x !== 30) { // Не ставим деревья на реке
        map[y][x] = 1; // Ёлка
        treesPlaced++;
      }
    }

    return map;
  };

  const generateVillageMap = () => {
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    const cabinX = 19;
    const cabinY = 14;
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        map[cabinY + dy][cabinX + dx] = 2; // Хижина
      }
    }

    let treesPlaced = 0;
    while (treesPlaced < 20) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (
        map[y][x] === 0 &&
        !(x >= 19 && x <= 21 && y >= 14 && y <= 16) &&
        !(x === 20 && y === 17)
      ) {
        map[y][x] = 1; // Ёлка
        treesPlaced++;
      }
    }

    return map;
  };

  const generateHouseMap = () => {
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    map[15][5] = 3; // NPC у левой стены

    return map;
  };

  const [forestMap, setForestMap] = useState(generateForestMap);
  const [villageMap, setVillageMap] = useState(generateVillageMap);
  const [houseMap, setHouseMap] = useState(generateHouseMap);
  const [gameMap, setGameMap] = useState(forestMap);

  const drawBlock = (ctx, baseX, baseY, gridX, gridY, color) => {
    const blockX = baseX + gridX * BLOCK_SIZE;
    const blockY = baseY + gridY * BLOCK_SIZE;
    ctx.fillStyle = color;
    ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
  };

  const renderTile = (ctx, x, y, tile) => {
    const baseX = x * TILE_SIZE;
    const baseY = y * TILE_SIZE;

    // Земля (0)
    if (tile === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);
    }

    // Ёлка (1)
    if (tile === 1) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const treePattern = [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      ];

      const offsetX = Math.floor((GRID_SIZE - 13) / 2);
      const offsetY = Math.floor((GRID_SIZE - 8) / 2);

      for (let py = 0; py < treePattern.length; py++) {
        for (let px = 0; px < treePattern[py].length; px++) {
          if (treePattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Хижина (2)
    if (tile === 2 && x === 19 && y === 14) {
      const cabinBaseX = 19 * TILE_SIZE;
      const cabinBaseY = 14 * TILE_SIZE;

      ctx.fillStyle = "black";
      ctx.fillRect(cabinBaseX, cabinBaseY, TILE_SIZE * 3, TILE_SIZE * 3);

      const cabinPattern = [
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
      ];

      for (let py = 0; py < 15; py++) {
        for (let px = 0; px < 15; px++) {
          if (cabinPattern[py][px] === 1) {
            drawBlock(ctx, cabinBaseX, cabinBaseY, px, py, COLOR);
          }
        }
      }
    }

    // NPC (3)
    if (tile === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const npcPattern = [
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
      ];

      const offsetX = Math.floor((GRID_SIZE - 12) / 2);
      const offsetY = Math.floor((GRID_SIZE - 8) / 2);

      for (let py = 0; py < npcPattern.length; py++) {
        for (let px = 0; px < npcPattern[py].length; px++) {
          if (npcPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Блок древесины (4) — полный квадрат 10x10
    if (tile === 4) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const woodPattern = Array(10).fill().map(() => Array(10).fill(1)); // 10x10 заполненный квадрат

      const offsetX = 0; // Без смещения, так как заполняем весь тайл
      const offsetY = 0;

      for (let py = 0; py < woodPattern.length; py++) {
        for (let px = 0; px < woodPattern[py].length; px++) {
          if (woodPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Вода (5) — полосатый узор
    if (tile === 5) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const waterPattern = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const offsetX = 0;
      const offsetY = 0;

      for (let py = 0; py < waterPattern.length; py++) {
        for (let px = 0; px < waterPattern[py].length; px++) {
          if (waterPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }
  };

  const renderPlayer = (ctx) => {
    const baseX = player.x * TILE_SIZE;
    const baseY = player.y * TILE_SIZE;

    ctx.fillStyle = "black";
    ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

    const playerPatternRight = [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    ];

    const playerPatternLeft = playerPatternRight.map(row => [...row].reverse());

    const playerPatternUp = [
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    ];

    const playerPatternDown = playerPatternUp.map(row => [...row].reverse());

    let playerPattern;
    if (direction === "right") playerPattern = playerPatternRight;
    else if (direction === "left") playerPattern = playerPatternLeft;
    else if (direction === "up") playerPattern = playerPatternUp;
    else playerPattern = playerPatternDown;

    const offsetX = Math.floor((GRID_SIZE - 12) / 2);
    const offsetY = Math.floor((GRID_SIZE - 8) / 2);

    for (let py = 0; py < playerPattern.length; py++) {
      for (let px = 0; px < playerPattern[py].length; px++) {
        if (playerPattern[py][px] === 1) {
          drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
        }
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        renderTile(ctx, x, y, gameMap[y][x]);
      }
    }

    renderPlayer(ctx);
  };

  const interact = () => {
    let targetX = player.x;
    let targetY = player.y;

    if (direction === "right") targetX += 1;
    else if (direction === "left") targetX -= 1;
    else if (direction === "up") targetY -= 1;
    else if (direction === "down") targetY += 1;

    if (
      targetX >= 0 &&
      targetX < MAP_WIDTH &&
      targetY >= 0 &&
      targetY < MAP_HEIGHT &&
      (gameMap[targetY][targetX] === 1 || gameMap[targetY][targetX] === 4)
    ) {
      const newMap = gameMap.map(row => [...row]);
      const isTree = gameMap[targetY][targetX] === 1;
      newMap[targetY][targetX] = 0; // Удаляем ёлку или блок древесины

      if (currentLocation === "forest") setForestMap(newMap);
      else if (currentLocation === "village") setVillageMap(newMap);
      setGameMap(newMap);

      setInventory(prev => ({
        ...prev,
        wood: prev.wood + (isTree ? 7 : 1),
      }));
    }
  };

  const plantTreeOrPlaceWood = () => {
    let targetX = player.x;
    let targetY = player.y;

    if (direction === "right") targetX += 1;
    else if (direction === "left") targetX -= 1;
    else if (direction === "up") targetY -= 1;
    else if (direction === "down") targetY += 1;

    if (
      targetX >= 0 &&
      targetX < MAP_WIDTH &&
      targetY >= 0 &&
      targetY < MAP_HEIGHT &&
      gameMap[targetY][targetX] === 0
    ) {
      const newMap = gameMap.map(row => [...row]);

      if (selectedItem === "wood" && inventory.wood > 0) {
        newMap[targetY][targetX] = 4;
        setInventory(prev => ({ ...prev, wood: prev.wood - 1 }));
        if (inventory.wood - 1 === 0) setSelectedItem(null);
      } else if (selectedItem === null) {
        newMap[targetY][targetX] = 1;
      } else {
        return;
      }

      if (currentLocation === "forest") setForestMap(newMap);
      else if (currentLocation === "village") setVillageMap(newMap);
      else if (currentLocation === "house") setHouseMap(newMap);
      setGameMap(newMap);
    }
  };

  const heal = () => {
    if (health < maxHealth && inventory.wood > 0) {
      setHealth(prev => prev + 1);
      setInventory(prev => ({ ...prev, wood: prev.wood - 1 }));
      if (inventory.wood - 1 === 0 && selectedItem === "wood") {
        setSelectedItem(null);
      }
    }
  };

  const move = (dx, dy, key) => {
    const newDirection = dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down";

    if (lastKey !== key) {
      setDirection(newDirection);
      setLastKey(key);
      return;
    }

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (currentLocation === "forest" && newX >= MAP_WIDTH) {
      setCurrentLocation("village");
      setGameMap(villageMap);
      setPlayer({ x: 0, y: player.y });
      setDirection("right");
      setLastKey(null);
      return;
    }

    if (currentLocation === "village" && newX < 0) {
      setCurrentLocation("forest");
      setGameMap(forestMap);
      setPlayer({ x: MAP_WIDTH - 1, y: player.y });
      setDirection("left");
      setLastKey(null);
      return;
    }

    if (currentLocation === "village" && newX === 20 && newY === 17) {
      setCurrentLocation("house");
      setGameMap(houseMap);
      setPlayer({ x: 35, y: 15 });
      setDirection("left");
      setLastKey(null);
      return;
    }

    if (currentLocation === "house" && newX === 38 && newY === 15) {
      setCurrentLocation("village");
      setGameMap(villageMap);
      setPlayer({ x: 20, y: 17 });
      setDirection("down");
      setLastKey(null);
      return;
    }

    if (
      newX >= 0 &&
      newX < MAP_WIDTH &&
      newY >= 0 &&
      newY < MAP_HEIGHT &&
      gameMap[newY][newX] !== 1 &&
      gameMap[newY][newX] !== 2 &&
      gameMap[newY][newX] !== 3 &&
      gameMap[newY][newX] !== 4 &&
      gameMap[newY][newX] !== 5 // Нельзя проходить через воду
    ) {
      setPlayer({ x: newX, y: newY });
      setDirection(newDirection);
    }
  };

  useEffect(() => {
    let timeout;
    const handleKey = (e) => {
      if (timeout) return;
      timeout = setTimeout(() => {
        if (e.key === "ArrowUp") move(0, -1, "ArrowUp");
        if (e.key === "ArrowDown") move(0, 1, "ArrowDown");
        if (e.key === "ArrowLeft") move(-1, 0, "ArrowLeft");
        if (e.key === "ArrowRight") move(1, 0, "ArrowRight");
        if (e.key === " ") interact();
        if (e.key === "Enter") plantTreeOrPlaceWood();
        if (e.key === "Control") heal();
        timeout = null;
      }, 100); // 100ms debounce
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player, direction, currentLocation, gameMap, inventory, selectedItem, lastKey, health]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        if (inventory.wood > 0) setSelectedItem("wood");
      } else if (e.deltaY > 0) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [inventory]);

  useEffect(() => {
    render();
  }, [player, direction, gameMap]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        height: "100vh",
      }}
    >
      <h1 style={{ color: COLOR, fontFamily: "monospace", fontSize: "20px" }}>
        Игра на выживание (пиксельный стиль) - {currentLocation === "forest" ? "Лес" : currentLocation === "village" ? "Деревня" : "Дом"}
      </h1>
      <div style={{ color: COLOR, fontFamily: "monospace", fontSize: "16px", marginBottom: "10px" }}>
        Инвентарь: Древесина: {inventory.wood} | Выбрано: {selectedItem ? "древесина" : "ничего"} | Здоровье: {health}/{maxHealth}
      </div>
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH * TILE_SIZE}
        height={MAP_HEIGHT * TILE_SIZE}
        style={{
          border: `2px solid ${COLOR}`,
          imageRendering: "pixelated",
        }}
      />
      <p style={{ color: "#888", fontFamily: "monospace" }}>
        Стрелки: повернуться/двигаться | Пробел: рубить/ломать | Enter: сажать/ставить | Колесо мыши: выбрать предмет | Ctrl: лечиться
      </p>
    </div>
  );
}