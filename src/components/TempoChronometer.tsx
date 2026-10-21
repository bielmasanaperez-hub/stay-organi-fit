"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Flame,
  ShowerHead,
  GraduationCap,
  Volume2,
  VolumeX,
  Timer,
} from "lucide-react";
import { TempoBlock } from "@/lib/eurofitness-plan";

interface TempoChronometerProps {
  tempos: TempoBlock[];
  activeTempoId: string;
  onSelectTempo: (id: string) => void;
  accentColor: string;
}

export default function TempoChronometer({
  tempos,
  activeTempoId,
  onSelectTempo,
  accentColor,
}: TempoChronometerProps) {
  const activeTempo =
    tempos.find((t) => t.id === activeTempoId) || tempos[0];

  const [secondsLeft, setSecondsLeft] = useState<number>(
    activeTempo.durationMinutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("08:00");
  const [morningStatus, setMorningStatus] = useState<string>(
    "Horario de mañana: 08:00 – 09:10h"
  );

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSoftBeep = useCallback(
    (freq = 660, duration = 0.16) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore autoplay restrictions
      }
    },
    [soundEnabled]
  );

  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(activeTempo.durationMinutes * 60);
  }, [activeTempo]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setCurrentTimeStr(`${hh}:${mm}`);

      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const start800 = 8 * 60;
      const end900 = 9 * 60;
      const end910 = 9 * 60 + 10;
      const end930 = 9 * 60 + 30;

      if (totalMinutes >= start800 && totalMinutes < start800 + 8) {
        setMorningStatus("En curso: Tempo 1 · Calentamiento (08:00 - 08:08)");
      } else if (totalMinutes >= start800 + 8 && totalMinutes < start800 + 53) {
        setMorningStatus("En curso: Tempo 2 · Bloque Principal (08:08 - 08:53)");
      } else if (totalMinutes >= start800 + 53 && totalMinutes < end900) {
        setMorningStatus("En curso: Tempo 3 · Estiramientos (08:53 - 09:00)");
      } else if (totalMinutes >= end900 && totalMinutes < end910) {
        setMorningStatus("Ducha Express y vestuario (09:00 - 09:10)");
      } else if (totalMinutes >= end910 && totalMinutes <= end930) {
        setMorningStatus("Camino a la Universidad (Entrada 09:30h)");
      } else {
        setMorningStatus("Planificación matutina · 08:00 a 09:10h");
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playSoftBeep(784, 0.22);
          setIsRunning(false);
          const idx = tempos.findIndex((t) => t.id === activeTempo.id);
          if (idx >= 0 && idx < tempos.length - 1) {
            onSelectTempo(tempos[idx + 1].id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, activeTempo, tempos, onSelectTempo, playSoftBeep]);

  useEffect(() => {
    if (restSecondsLeft === null) return;
    if (restSecondsLeft <= 0) {
      playSoftBeep(880, 0.2);
      setRestSecondsLeft(null);
      return;
    }
    const t = setTimeout(() => {
      setRestSecondsLeft((r) => (r !== null ? r - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [restSecondsLeft, playSoftBeep]);

  const formatMMSS = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalTempoSeconds = activeTempo.durationMinutes * 60;
  const elapsedPct =
    totalTempoSeconds > 0
      ? Math.min(
          100,
          Math.round(((totalTempoSeconds - secondsLeft) / totalTempoSeconds) * 100)
        )
      : 0;

  return (
    <div className="clean-card rounded-2xl p-5 shadow-lg">
      {/* Cabecera limpia de horario */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs sm:text-sm font-medium text-slate-200">
            {morningStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTimeStr}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition"
            title={soundEnabled ? "Silenciar aviso" : "Activar aviso sonoro"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Pestañas de los 4 Tempos de la mañana */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {tempos.map((t, index) => {
          const isSelected = t.id === activeTempo.id;
          const isShower = t.phaseType === "shower";
          return (
            <button
              key={t.id}
              onClick={() => onSelectTempo(t.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-slate-800/95 border-slate-500 shadow-sm"
                  : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className="font-semibold"
                  style={{ color: isSelected ? accentColor : undefined }}
                >
                  {isShower ? "Ducha" : `Tempo ${index + 1}`}
                </span>
                <span className="text-slate-400">{t.durationMinutes} min</span>
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {t.startTime} – {t.endTime}
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {t.title.split("·")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel del Temporizador Activo */}
      <div className="bg-slate-900/75 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-white tracking-tight">
              {formatMMSS(secondsLeft)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {elapsedPct}% hecho
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">
              {activeTempo.startTime} a {activeTempo.endTime} ({activeTempo.durationMinutes} min)
            </span>
            <h3 className="text-base font-semibold text-white mt-0.5">
              {activeTempo.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeTempo.description}
            </p>
          </div>
        </div>

        {/* Botones de control y descanso */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 flex items-center gap-2 transition hover:opacity-95"
            style={{ backgroundColor: accentColor }}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Tempo</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(activeTempo.durationMinutes * 60);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title="Reiniciar tiempo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <Timer className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-xs text-slate-300 mr-1">Descanso:</span>
            {[30, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => setRestSecondsLeft(sec)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-xs font-medium text-slate-100 transition"
              >
                {sec}s
              </button>
            ))}
            {restSecondsLeft !== null && (
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
              >
                {restSecondsLeft}s
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de franja horaria inferior */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            08:00–09:00 Entreno
          </span>
          <span className="flex items-center gap-1.5">
            <ShowerHead className="w-3.5 h-3.5 text-sky-400" />
            09:00–09:10 Ducha
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            09:30 Entrada Uni
          </span>
        </div>
        <span>Eurofitness Estació del Nord</span>
      </div>
    </div>
  );
}
