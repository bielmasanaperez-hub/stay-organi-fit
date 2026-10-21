"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  ShowerHead,
  GraduationCap,
  Volume2,
  VolumeX,
  Timer,
  Flame,
} from "lucide-react";
import { TempoBlock } from "@/lib/eurofitness-plan";

interface TempoChronometerProps {
  tempos: TempoBlock[];
  activeTempoId: string;
  onSelectTempo: (id: string) => void;
  accentColor?: string;
}

const ROMAN_STEPS = ["I", "II", "III", "IV"];

export default function TempoChronometer({
  tempos,
  activeTempoId,
  onSelectTempo,
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
    "Franja Matutina · 08:00 a 09:10h"
  );

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(
    (freq = 587.33, duration = 0.22) => {
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
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore browser autoplay policies
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
        setMorningStatus("En Curso · Fase I Activación (08:00 – 08:08)");
      } else if (totalMinutes >= start800 + 8 && totalMinutes < start800 + 53) {
        setMorningStatus("En Curso · Fase II Bloque Principal (08:08 – 08:53)");
      } else if (totalMinutes >= start800 + 53 && totalMinutes < end900) {
        setMorningStatus("En Curso · Fase III Vuelta a la Calma (08:53 – 09:00)");
      } else if (totalMinutes >= end900 && totalMinutes < end910) {
        setMorningStatus("Vestuario & Ducha Express (09:00 – 09:10)");
      } else if (totalMinutes >= end910 && totalMinutes <= end930) {
        setMorningStatus("Traslado hacia la Universidad (Entrada 09:30h)");
      } else {
        setMorningStatus("Cronograma Privado · 08:00 a 09:10h");
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
          playChime(659.25, 0.25);
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
  }, [isRunning, activeTempo, tempos, onSelectTempo, playChime]);

  useEffect(() => {
    if (restSecondsLeft === null) return;
    if (restSecondsLeft <= 0) {
      playChime(783.99, 0.22);
      setRestSecondsLeft(null);
      return;
    }
    const t = setTimeout(() => {
      setRestSecondsLeft((r) => (r !== null ? r - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [restSecondsLeft, playChime]);

  const formatMMSS = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalTempoSeconds = activeTempo.durationMinutes * 60;
  const progressFraction =
    totalTempoSeconds > 0
      ? Math.min(1, Math.max(0, (totalTempoSeconds - secondsLeft) / totalTempoSeconds))
      : 0;
  const elapsedPct = Math.round(progressFraction * 100);

  // SVG Ring geometry
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <section className="luxury-panel rounded-2xl p-6 sm:p-7 shadow-2xl">
      {/* Top Bar: Club Chronometer Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-club-gold/15">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-club-gold" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-club-gold font-semibold">
            {morningStatus}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-full bg-club-obsidian/90 border border-club-gold/20 text-xs font-mono text-club-ivory flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-club-gold" />
            <span>{currentTimeStr}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-club-obsidian/90 border border-white/10 text-club-stone hover:text-club-ivory transition"
            title={soundEnabled ? "Silenciar aviso acústico" : "Activar aviso acústico"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-club-gold" />
            ) : (
              <VolumeX className="w-4 h-4 text-club-muted" />
            )}
          </button>
        </div>
      </div>

      {/* 4 Luxury Phase Selectors (08:00 - 09:10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tempos.map((t, index) => {
          const isSelected = t.id === activeTempo.id;
          const isShower = t.phaseType === "shower";
          return (
            <button
              key={t.id}
              onClick={() => onSelectTempo(t.id)}
              className={`p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${
                isSelected
                  ? "bg-club-elevated border-club-gold/60 shadow-lg"
                  : "luxury-subcard hover:border-club-gold/25"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-club-gold to-transparent" />
              )}
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-serif text-xs uppercase tracking-[0.18em] ${
                    isSelected ? "text-club-gold font-semibold" : "text-club-stone"
                  }`}
                >
                  {isShower ? "IV · VESTUARIO" : `TEMPO ${ROMAN_STEPS[index] || index + 1}`}
                </span>
                <span className="font-mono text-[11px] text-club-stone">
                  {t.durationMinutes} MIN
                </span>
              </div>

              <div className="font-serif text-xl font-semibold text-club-ivory mt-1 tracking-tight">
                {t.startTime} — {t.endTime}
              </div>

              <div className="text-xs text-club-stone truncate mt-1 font-normal">
                {t.title.split("·")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chronometer Dial & Active Phase Console */}
      <div className="luxury-subcard rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Precision SVG Ring Dial */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 92 92">
              <circle
                cx="46"
                cy="46"
                r={radius}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="46"
                cy="46"
                r={radius}
                stroke="#C8A97E"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xl font-semibold text-club-ivory tracking-tight">
                {formatMMSS(secondsLeft)}
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-club-stone mt-0.5">
                {elapsedPct}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-club-gold font-semibold block">
              Franja Activa · {activeTempo.startTime} a {activeTempo.endTime} ({activeTempo.durationMinutes} min)
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-club-ivory leading-snug">
              {activeTempo.title}
            </h3>
            <p className="text-xs sm:text-sm text-club-stone max-w-xl leading-relaxed">
              {activeTempo.description}
            </p>
          </div>
        </div>

        {/* Tactile Controls & Series Recovery Intervals */}
        <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-3 rounded-xl bg-club-gold hover:bg-club-goldLight text-club-obsidian text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2.5 transition shadow-md"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Fase</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(activeTempo.durationMinutes * 60);
            }}
            className="p-3 rounded-xl bg-club-elevated hover:bg-club-border border border-white/10 text-club-stone hover:text-club-ivory transition"
            title="Reiniciar fase"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Series Rest Interval Selector */}
          <div className="flex items-center gap-1.5 bg-club-obsidian/90 border border-white/10 px-3.5 py-2 rounded-xl">
            <Timer className="w-3.5 h-3.5 text-club-gold mr-1" />
            <span className="text-[11px] uppercase tracking-wider text-club-stone mr-1">
              Pausa:
            </span>
            {[30, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => setRestSecondsLeft(sec)}
                className="px-2.5 py-1 rounded-lg bg-club-elevated hover:bg-club-gold hover:text-club-obsidian text-xs font-mono text-club-ivory transition"
              >
                {sec}s
              </button>
            ))}
            {restSecondsLeft !== null && (
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="ml-1 px-3 py-1 rounded-lg bg-club-gold text-club-obsidian font-mono text-xs font-bold"
              >
                {restSecondsLeft}s
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Club Schedule Guarantee Bar */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.15em] text-club-stone">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-club-gold" />
            08:00–09:00 Sesión (60m)
          </span>
          <span className="flex items-center gap-2">
            <ShowerHead className="w-3.5 h-3.5 text-club-gold" />
            09:00–09:10 Vestuario & Ducha (10m)
          </span>
          <span className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-club-gold" />
            09:30 Entrada Universidad
          </span>
        </div>
        <span className="text-club-gold/90 font-serif italic normal-case text-sm tracking-normal">
          Puntualidad garantizada · Eurofitness Estació del Nord
        </span>
      </div>
    </section>
  );
}
