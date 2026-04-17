/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, Play, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Point, Direction } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 140;
const MIN_SPEED = 50;
const SPEED_INCREMENT = 3;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE || 
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      const interval = window.setInterval(moveSnake, speed);
      return () => window.clearInterval(interval);
    }
  }, [isPaused, isGameOver, moveSnake, speed]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw harsh background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines - subtle but jagged
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
       ctx.strokeRect(i * CELL_SIZE, 0, 1, canvas.height);
       ctx.strokeRect(0, i * CELL_SIZE, canvas.width, 1);
    }

    // Snake - Glitch blocks
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      // Flicker effect
      if (Math.random() > 0.98) ctx.fillStyle = '#ffff00';
      
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Screen tear segments
      if (Math.random() > 0.99) {
        ctx.fillRect(segment.x * CELL_SIZE + 10, segment.y * CELL_SIZE, 50, 2);
      }
    });

    // Food - Warning pixel
    ctx.fillStyle = '#ffff00';
    if (Math.random() > 0.95) ctx.fillStyle = '#00ffff';
    ctx.fillRect(food.x * CELL_SIZE + 4, food.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD - Machine readout */}
      <div className="w-full max-w-[400px] bg-black border-4 border-glitch-magenta p-4 font-mono uppercase">
        <div className="flex justify-between items-center">
          <div className="text-glitch-magenta leading-none">
            <p className="text-[8px] mb-1">SCORE_VAL</p>
            <h3 className="text-2xl font-bold tracking-tighter">{score.toString().padStart(4, '0')}</h3>
          </div>
          <div className="text-glitch-cyan text-right leading-none">
            <p className="text-[8px] mb-1">RECORD_VAL</p>
            <h3 className="text-2xl font-bold tracking-tighter">{highScore.toString().padStart(4, '0')}</h3>
          </div>
        </div>
      </div>

      <div className="relative border-4 border-glitch-cyan">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-2xl text-glitch-magenta mb-4 glitch-text" data-text="CORE_DUMP">CORE_DUMP</h2>
                  <p className="text-glitch-cyan text-[10px] mb-8 font-mono tracking-[0.2em]">SEGMENTATION_FAULT_AT_HEX_0x1337</p>
                  <button
                    onClick={resetGame}
                    className="bg-glitch-magenta text-black px-6 py-2 font-display text-[10px] hover:bg-white transition-colors uppercase font-bold"
                  >
                     R3TRY_INT
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-glitch-cyan mb-4 glitch-text" data-text="HLT_COMMAND">HLT_COMMAND</h2>
                  <p className="text-glitch-magenta text-[10px] mb-8 font-mono tracking-[0.2em]">WAITING_FOR_S1GNAL...</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-glitch-cyan text-black px-6 py-2 font-display text-[10px] hover:bg-white transition-colors uppercase font-bold"
                  >
                     C0NTINUE
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-glitch-yellow font-mono text-[8px] tracking-[0.3em] font-bold animate-pulse">
        SENSORS: ACTIVE // GRID: STABLE
      </div>
    </div>
  );
}
