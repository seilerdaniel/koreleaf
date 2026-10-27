'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';

interface PomodoroTimerProps {
  onCompleteSession?: () => void;
}

export function PomodoroTimer({ onCompleteSession }: PomodoroTimerProps) {
  const [mode, setMode] = useState<25 | 50>(50);
  const [timeLeft, setTimeLeft] = useState<number>(50 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isZen, setIsZen] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Cambiar preset de tiempo
  const handleModeChange = (newMode: 25 | 50) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode * 60);
  };

  // Lógica del temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (onCompleteSession) onCompleteSession();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onCompleteSession]);

  // Manejo de Wake Lock (Mantener pantalla encendida en Modo Zen)
  useEffect(() => {
    const requestWakeLock = async () => {
      if (isZen && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Error con Wake Lock:', err);
        }
      } else if (!isZen && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
    requestWakeLock();
  }, [isZen]);

  // Formato MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Salir de Modo Zen manteniendo presionado 2 segundos
  const startHoldExit = () => {
    let current = 0;
    holdIntervalRef.current = setInterval(() => {
      current += 10;
      setHoldProgress(current);
      if (current >= 100) {
        clearInterval(holdIntervalRef.current!);
        setIsZen(false);
        setHoldProgress(0);
      }
    }, 20);
  };

  const cancelHoldExit = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setHoldProgress(0);
  };

  return (
    <>
      {/* TARJETA COMPACTA EN DASHBOARD */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 shadow-lg flex flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
            Trabajo Enfocado
          </span>
          <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800/60">
            <button
              onClick={() => handleModeChange(25)}
              className={`px-2.5 py-0.5 text-xs rounded-md transition-colors ${
                mode === 25 ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              25m
            </button>
            <button
              onClick={() => handleModeChange(50)}
              className={`px-2.5 py-0.5 text-xs rounded-md transition-colors ${
                mode === 50 ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              50m
            </button>
          </div>
        </div>

        {/* Display del Tiempo */}
        <div className="font-mono text-5xl font-light tracking-tight text-zinc-100 my-2">
          {formatTime(timeLeft)}
        </div>

        {/* Botones de Control */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 p-2.5 rounded-lg transition-all"
            title={isRunning ? 'Pausar' : 'Iniciar'}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(mode * 60);
            }}
            className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 p-2.5 rounded-lg border border-zinc-700/50 transition-all"
            title="Reiniciar"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsZen(true)}
            className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 p-2.5 rounded-lg border border-zinc-700/50 transition-all"
            title="Activar Modo Zen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* MODAL MODO ZEN PANTALLA COMPLETA */}
      {isZen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center select-none p-6">
          <span className="text-xs tracking-widest text-zinc-500 uppercase font-medium mb-4">
            Proyecto Personal — Modo Zen
          </span>

          <div className="font-mono text-7xl md:text-9xl text-zinc-100 font-extralight tracking-tight my-8">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-4 mb-12">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-6 py-3 rounded-xl font-medium text-sm transition-all"
            >
              {isRunning ? 'Pausar' : 'Continuar'}
            </button>
          </div>

          {/* Botón Mantener Presionado para Salir */}
          <div className="relative">
            <button
              onMouseDown={startHoldExit}
              onMouseUp={cancelHoldExit}
              onMouseLeave={cancelHoldExit}
              onTouchStart={startHoldExit}
              onTouchEnd={cancelHoldExit}
              className="relative overflow-hidden text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2.5 px-6 border border-zinc-800/80 rounded-full"
            >
              <span className="relative z-10">Mantén presionado para salir</span>
              <div
                className="absolute left-0 top-0 bottom-0 bg-zinc-800 transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}