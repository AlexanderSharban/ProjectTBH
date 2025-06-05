"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";

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
  const [entryDirection, setEntryDirection] = useState(null); // Направление при входе в хижину
  const [currentLocation, setCurrentLocation] = useState("forest");
  const [inventory, setInventory] = useState({ wood: 0, water: 0, cabin: 0 }); // Инвентарь
  const [selectedItem, setSelectedItem] = useState(null); // Выбранный предмет (null, "wood", "water", "cabin")
  const [lastKey, setLastKey] = useState(null); // Последняя нажатая клавиша
  const [health, setHealth] = useState(10); // Здоровье игрока
  const maxHealth = 10; // Максимальное здоровье
  const [isUnderwater, setIsUnderwater] = useState(false); // Находится ли игрок под водой
  const [underwaterTimer, setUnderwaterTimer] = useState(0); // Время под водой (в секундах)
  const [isGameOver, setIsGameOver] = useState(false); // Состояние игры (окончена или нет)
  const [isCraftingMenuOpen, setIsCraftingMenuOpen] = useState(false); // Открыто ли меню крафта
  const [craftedHouses, setCraftedHouses] = useState({}); // Хранилище карт для построенных хижин
  const [activeCabinCoords, setActiveCabinCoords] = useState(null); // Координаты активной хижины
  const lastRenderRef = useRef(0); // Для предотвращения множественных рендеров

  const generateForestMap = () => {
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    const lakePattern = [
      [0, 0, 5, 5, 5, 0, 0],
      [0, 5, 5, 5, 5, 5, 0],
      [5, 5, 5, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 5, 5],
      [0, 5, 5, 5, 5, 5, 0],
      [0, 0, 5, 5, 5, 0, 0],
      [0, 0, 0, 5, 0, 0, 0],
    ];
    const lakeX = 28;
    const lakeY = 13;
    for (let y = 0; y < lakePattern.length; y++) {
      for (let x = 0; x < lakePattern[y].length; x++) {
        if (lakePattern[y][x] === 5 && lakeX + x < MAP_WIDTH && lakeY + y < MAP_HEIGHT) {
          map[lakeY + y][lakeX + x] = 5; // Вода
        }
      }
    }

    let treesPlaced = 0;
    while (treesPlaced < 100) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (map[y][x] === 0 && !(x >= 28 && x <= 34 && y >= 13 && y <= 19)) {
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

    const cabinX = 20;
    const cabinY = 15;
    map[cabinY][cabinX] = 2; // Хижина (1x1)

    let treesPlaced = 0;
    while (treesPlaced < 20) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (
        map[y][x] === 0 &&
        !(x === 20 && y === 15)
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

  const generateCraftedHouseMap = () => {
    return Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));
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

    if (tile === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);
    } else if (tile === 1) {
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
    } else if (tile === 2) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);
      const cabinPattern = [
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
      ];
      const offsetX = Math.floor((GRID_SIZE - 13) / 2);
      const offsetY = Math.floor((GRID_SIZE - 8) / 2);
      for (let py = 0; py < cabinPattern.length; py++) {
        for (let px = 0; px < cabinPattern[py].length; px++) {
          if (cabinPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    } else if (tile === 3) {
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
    } else if (tile === 4) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);
      const woodPattern = Array(10).fill().map(() => Array(10).fill(1));
      const offsetX = 0;
      const offsetY = 0;
      for (let py = 0; py < woodPattern.length; py++) {
        for (let px = 0; px < woodPattern[py].length; px++) {
          if (woodPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    } else if (tile === 5) {
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

    const playerPatternLeft = playerPatternRight.map((row) => [...row].reverse());
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
    const playerPatternDown = playerPatternUp.map((row) => [...row].reverse());

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
    const now = Date.now();
    if (now - lastRenderRef.current < 16) return; // Ограничиваем рендеринг до 60 FPS
    lastRenderRef.current = now;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      targetY < MAP_HEIGHT
    ) {
      const targetTile = gameMap[targetY][targetX];
      if (targetTile === 1 || targetTile === 4) {
        const newMap = gameMap.map((row) => [...row]);
        const isTree = targetTile === 1;
        newMap[targetY][targetX] = 0;

        if (currentLocation === "forest") setForestMap(newMap);
        else if (currentLocation === "village") setVillageMap(newMap);
        setGameMap(newMap);

        setInventory((prev) => ({
          ...prev,
          wood: prev.wood + (isTree ? 7 : 1),
        }));
      } else if (targetTile === 2) {
        const newMap = gameMap.map((row) => [...row]);
        newMap[targetY][targetX] = 0;

        if (currentLocation === "forest") setForestMap(newMap);
        else if (currentLocation === "village") setVillageMap(newMap);
        setGameMap(newMap);

        const houseKey = `${targetX},${targetY}`;
        setCraftedHouses((prev) => {
          const newHouses = { ...prev };
          delete newHouses[houseKey];
          return newHouses;
        });

        setInventory((prev) => ({
          ...prev,
          cabin: prev.cabin + 1,
        }));
      } else if (targetTile === 5) {
        const newMap = gameMap.map((row) => [...row]);
        let adjacentWaterTiles = 0;
        const directions = [
          { dx: 0, dy: -1 }, // вверх
          { dx: 0, dy: 1 },  // вниз
          { dx: -1, dy: 0 }, // влево
          { dx: 1, dy: 0 },  // вправо
        ];

        for (const { dx, dy } of directions) {
          const checkX = targetX + dx;
          const checkY = targetY + dy;
          if (
            checkX >= 0 &&
            checkX < MAP_WIDTH &&
            checkY >= 0 &&
            checkY < MAP_HEIGHT &&
            gameMap[checkY][checkX] === 5
          ) {
            adjacentWaterTiles++;
          }
        }

        if (adjacentWaterTiles < 2) {
          newMap[targetY][targetX] = 0;
          if (currentLocation === "forest") setForestMap(newMap);
          else if (currentLocation === "village") setVillageMap(newMap);
          setGameMap(newMap);
        }

        setInventory((prev) => ({
          ...prev,
          water: prev.water + 1,
        }));
      }
    }
  };

  const plantTreeOrPlaceItem = () => {
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
      const newMap = gameMap.map((row) => [...row]);

      if (selectedItem === "wood" && inventory.wood > 0) {
        newMap[targetY][targetX] = 4;
        setInventory((prev) => ({ ...prev, wood: prev.wood - 1 }));
        if (inventory.wood - 1 === 0) setSelectedItem(null);
      } else if (selectedItem === "water" && inventory.water > 0) {
        newMap[targetY][targetX] = 5;
        setInventory((prev) => ({ ...prev, water: prev.water - 1 }));
        if (inventory.water - 1 === 0) setSelectedItem(null);
      } else if (selectedItem === "cabin" && inventory.cabin > 0) {
        newMap[targetY][targetX] = 2;
        setInventory((prev) => ({ ...prev, cabin: prev.cabin - 1 }));
        if (inventory.cabin - 1 === 0) setSelectedItem(null);

        const houseKey = `${targetX},${targetY}`;
        setCraftedHouses((prev) => ({
          ...prev,
          [houseKey]: generateCraftedHouseMap(),
        }));
      } else if (selectedItem === null) {
        newMap[targetY][targetX] = 1;
      } else {
        return;
      }

      if (currentLocation === "forest") setForestMap(newMap);
      else if (currentLocation === "village") setVillageMap(newMap);
      else if (currentLocation === "house" || currentLocation === "craftedHouse") setHouseMap(newMap);
      setGameMap(newMap);
    }
  };

  const craftCabin = () => {
    if (inventory.wood >= 10) {
      setInventory((prev) => ({
        ...prev,
        wood: prev.wood - 10,
        cabin: prev.cabin + 1,
      }));
      if (selectedItem === "wood" && prev.wood - 10 === 0) {
        setSelectedItem(null);
      }
    }
  };

  const heal = () => {
    if (health < maxHealth && inventory.wood > 0) {
      setHealth((prev) => prev + 1);
      setInventory((prev) => ({ ...prev, wood: prev.wood - 1 }));
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

    if (currentLocation === "village" && newX === 20 && newY === 15) {
      setCurrentLocation("house");
      setGameMap(houseMap);
      setPlayer({ x: 35, y: 15 });
      setDirection("left");
      setEntryDirection(direction);
      setLastKey(null);
      return;
    }

    if ((currentLocation === "forest" || currentLocation === "village") && gameMap[newY][newX] === 2) {
      const houseKey = `${newX},${newY}`;
      if (craftedHouses[houseKey]) {
        setCurrentLocation("craftedHouse");
        setGameMap(craftedHouses[houseKey]);
        setPlayer({ x: 35, y: 15 });
        setActiveCabinCoords({ x: newX, y: newY });
        setDirection("left");
        setEntryDirection(direction);
        setLastKey(null);
        return;
      }
    }

    if (currentLocation === "house" && newX === 38 && newY === 15) {
      setCurrentLocation("village");
      setGameMap(villageMap);
      let exitX = 20;
      let exitY = 15;
      if (entryDirection === "right") exitX -= 1;
      else if (entryDirection === "left") exitX += 1;
      else if (entryDirection === "up") exitY += 1;
      else if (entryDirection === "down") exitY -= 1;
      setPlayer({ x: exitX, y: exitY });
      setDirection("down");
      setEntryDirection(null);
      setLastKey(null);
      return;
    }

    if (currentLocation === "craftedHouse" && newX === 38 && newY === 15) {
      const returnMap = activeCabinCoords.x >= 19 && activeCabinCoords.y >= 14 && activeCabinCoords.x <= 21 && activeCabinCoords.y <= 16 ? villageMap : forestMap;
      setCurrentLocation(returnMap === villageMap ? "village" : "forest");
      setGameMap(returnMap);
      let exitX = activeCabinCoords.x;
      let exitY = activeCabinCoords.y;
      if (entryDirection === "right") exitX -= 1;
      else if (entryDirection === "left") exitX += 1;
      else if (entryDirection === "up") exitY += 1;
      else if (entryDirection === "down") exitY -= 1;
      setPlayer({ x: exitX, y: exitY });
      setDirection("down");
      setActiveCabinCoords(null);
      setEntryDirection(null);
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
      gameMap[newY][newX] !== 4
    ) {
      setPlayer({ x: newX, y: newY });
      setDirection(newDirection);
    }
  };

  const startNewGame = () => {
    setPlayer({ x: 5, y: 5 });
    setDirection("right");
    setEntryDirection(null);
    setCurrentLocation("forest");
    setInventory({ wood: 0, water: 0, cabin: 0 });
    setSelectedItem(null);
    setLastKey(null);
    setHealth(10);
    setIsUnderwater(false);
    setUnderwaterTimer(0);
    setIsGameOver(false);
    setIsCraftingMenuOpen(false);
    setCraftedHouses({});
    setActiveCabinCoords(null);
    const newForestMap = generateForestMap();
    const newVillageMap = generateVillageMap();
    const newHouseMap = generateHouseMap();
    setForestMap(newForestMap);
    setVillageMap(newVillageMap);
    setHouseMap(newHouseMap);
    setGameMap(newForestMap);
  };

  useEffect(() => {
    let interval;
    if (gameMap[player.y][player.x] === 5 && !isGameOver) {
      setIsUnderwater(true);
      interval = setInterval(() => {
        setUnderwaterTimer((prev) => {
          const newTime = prev + 1;
          if (newTime >= 60 && health > 0) {
            if (newTime % 5 === 0) {
              setHealth((prevHealth) => {
                const newHealth = Math.max(prevHealth - 1, 0);
                if (newHealth === 0) {
                  setIsGameOver(true);
                }
                return newHealth;
              });
            }
          }
          return newTime;
        });
      }, 1000);
    } else {
      setIsUnderwater(false);
      setUnderwaterTimer(0);
    }
    return () => clearInterval(interval);
  }, [player.x, player.y, gameMap, health, isGameOver]);

  useEffect(() => {
    if (health === 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [health, isGameOver]);

  useEffect(() => {
    let timeout;
    const handleKey = (e) => {
      if (timeout || isGameOver) return;
      timeout = setTimeout(() => {
        if (e.key === "ArrowUp") move(0, -1, "ArrowUp");
        if (e.key === "ArrowDown") move(0, 1, "ArrowDown");
        if (e.key === "ArrowLeft") move(-1, 0, "ArrowLeft");
        if (e.key === "ArrowRight") move(1, 0, "ArrowRight");
        if (e.key === " ") interact();
        if (e.key === "Enter") plantTreeOrPlaceItem();
        if (e.key === "Control") heal();
        if (e.key === "1") setIsCraftingMenuOpen((prev) => !prev);
        timeout = null;
      }, 100);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player, direction, currentLocation, gameMap, inventory, selectedItem, lastKey, health, isGameOver]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (isGameOver) return;
      if (e.deltaY < 0) {
        if (inventory.cabin > 0 && selectedItem !== "cabin") {
          setSelectedItem("cabin");
        } else if (inventory.water > 0 && selectedItem !== "water") {
          setSelectedItem("water");
        } else if (inventory.wood > 0 && selectedItem !== "wood") {
          setSelectedItem("wood");
        }
      } else if (e.deltaY > 0) {
        if (selectedItem === "cabin") {
          setSelectedItem(inventory.water > 0 ? "water" : inventory.wood > 0 ? "wood" : null);
        } else if (selectedItem === "water") {
          setSelectedItem(inventory.wood > 0 ? "wood" : null);
        } else {
          setSelectedItem(null);
        }
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [inventory, selectedItem, isGameOver]);

  useEffect(() => {
    if (!isGameOver) {
      render();
    }
  }, [player.x, player.y, direction, gameMap, isUnderwater, isGameOver]);

  if (isGameOver) {
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
        <h1 style={{ color: COLOR, fontFamily: "monospace", fontSize: "30px" }}>
          Игра окончена
        </h1>
        <button
          onClick={startNewGame}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "transparent",
            border: `2px solid ${COLOR}`,
            color: COLOR,
            fontFamily: "monospace",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Новая игра
        </button>
      </div>
    );
  }

      <Head>
        <title>Сапёр</title>
        <meta name="description" content="Игра Сапёр на React" />
      </Head>

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        height: "100vh",
        gap: "20px",
      }}
    >
      {isCraftingMenuOpen && (
        <div
          style={{
            width: "200px",
            padding: "10px",
            border: `2px solid ${COLOR}`,
            color: COLOR,
            fontFamily: "monospace",
            background: "black",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Крафт</h2>
          <div style={{ marginBottom: "10px" }}>
            <p>Хижина: 10 древесины</p>
            <button
              onClick={craftCabin}
              disabled={inventory.wood < 10}
              style={{
                padding: "5px 10px",
                background: "transparent",
                border: `1px solid ${COLOR}`,
                color: inventory.wood >= 10 ? COLOR : "#888",
                fontFamily: "monospace",
                cursor: inventory.wood >= 10 ? "pointer" : "not-allowed",
              }}
            >
              Крафт
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: COLOR, fontFamily: "monospace", fontSize: "20px" }}>
          Выживание -{" "}
          {currentLocation === "forest"
            ? "Лес"
            : currentLocation === "village"
            ? "Деревня"
            : currentLocation === "house"
            ? "Дом"
            : "Хижина"}
        </h1>
        <div style={{ color: COLOR, fontFamily: "monospace", fontSize: "16px", marginBottom: "10px" }}>
          Инвентарь: Древесина: {inventory.wood} | Вода: {inventory.water} | Хижина: {inventory.cabin} | Выбрано: {selectedItem === "wood" ? "древесина" : selectedItem === "water" ? "вода" : selectedItem === "cabin" ? "хижина" : "ничего"} | Здоровье: {health}/{maxHealth}
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
          Стрелки: повернуться/двигаться | Пробел: рубить/ломать/собирать воду/собирать хижину | Enter: сажать/ставить | Колесо мыши: выбрать предмет | Ctrl: лечиться | 1: меню крафта
        </p>
      </div>
    </div>
  );
}