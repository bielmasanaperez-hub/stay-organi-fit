"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Flame,
  ShowerHead,
  GraduationCap,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
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
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("08:00:00");
  const [morningStatus, setMorningStatus] = useState<{
    label: string;
    phase: string;
    progressPct: number;
  }>({
    label: "VENTANA MATUTINA 08:00 – 09:30",
    phase: "LISTO PARA EMPEZAR",
    progressPct: 0,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCyberBeep = useCallback(
    (freq = 880, duration = 0.18, double = false) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);

        if (double) {
          setTimeout(() => {
            playCyberBeep(freq * 1.25, duration, false);
          }, 200);
        }
      } catch {
        // Ignore audio errors if blocked by browser autoplay
      }
    },
    [soundEnabled]
  );

  // Sync timer when user switches Tempo tab
  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(activeTempo.durationMinutes * 60);
  }, [activeTempo]);

  // Live clock and 08:00 - 09:30 timeline tracker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setCurrentTimeStr(`${hh}:${mm}:${ss}`);

      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const start800 = 8 * 60; // 480
      const end900 = 9 * 60; // 540
      const end910 = 9 * 60 + 10; // 550
      const end930 = 9 * 60 + 30; // 570

      if (totalMinutes >= start800 && totalMinutes < start800 + 8) {
        setMorningStatus({
          label: "EN VIVO · TEMPO 01 (08:00 - 08:08)",
          phase: "CALENTAMIENTO & ACTIVACIÓN",
          progressPct: ((totalMinutes - start800) / 90) * 100,
        });
      } else if (totalMinutes >= start800 + 8 && totalMinutes < start800 + 53) {
        setMorningStatus({
          label: "EN VIVO · TEMPO 02 (08:08 - 08:53)",
          phase: "BLOQUE PRINCIPAL EUROFITNESS",
          progressPct: ((totalMinutes - start800) / 90) * 100,
        });
      } else if (totalMinutes >= start800 + 53 && totalMinutes < end900) {
        setMorningStatus({
          label: "EN VIVO · TEMPO 03 (08:53 - 09:00)",
          phase: "VUELTA A LA CALMA · PREPARAR DUCHA",
          progressPct: ((totalMinutes - start800) / 90) * 100,
        });
      } else if (totalMinutes >= end900 && totalMinutes < end910) {
        setMorningStatus({
          label: "🚨 ALERTA 09:00 – 09:10 · DUCHA EXPRESS",
          phase: "VESTUARIO & CAMBIO A OUTFIT UNI",
          progressPct: ((totalMinutes - start800) / 90) * 100,
        });
      } else if (totalMinutes >= end910 && totalMinutes <= end930) {
        setMorningStatus({
          label: "🎓 09:10 – 09:30 · CAMINO A LA UNI",
          phase: "ENTRADA UNIVERSIDAD A LAS 09:30H",
          progressPct: Math.min(100, ((totalMinutes - start800) / 90) * 100),
        });
      } else {
        setMorningStatus({
          label: "HORARIO MATUTINO · 08:00 A 09:10H",
          phase: "SIMULADOR DE TEMPOS LISTO",
          progressPct: 100,
        });
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Main Tempo countdown
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playCyberBeep(1046, 0.25, true);
          setIsRunning(false);
          // Auto-advance to next Tempo if available
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
  }, [isRunning, activeTempo, tempos, onSelectTempo, playCyberBeep]);

  // Micro Rest timer (30s / 60s / 90s between series)
  useEffect(() => {
    if (restSecondsLeft === null) return;
    if (restSecondsLeft <= 0) {
      playCyberBeep(1174, 0.2, true);
      setRestSecondsLeft(null);
      return;
    }
    const t = setTimeout(() => {
      setRestSecondsLeft((r) => (r !== null ? r - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [restSecondsLeft, playCyberBeep]);

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
    <div
      className="cyber-glass rounded-2xl border p-4 sm:p-5 relative overflow-hidden transition-all"
      style={{ borderColor: `${accentColor}45` }}
    >
      {/* Top glow bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* Header Timeline 08:00 -> 09:00 -> 09:10 -> 09:30 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300 font-semibold">
            {morningStatus.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/70 font-mono text-xs text-cyber-cyan flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            <span>{currentTimeStr}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/70 text-slate-300 hover:text-white transition"
            title={soundEnabled ? "Silenciar alertas de Tempo" : "Activar alertas sonoras"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Visual Timeline Bar: 08:00 - 09:00 - 09:10 - 09:30 */}
      <div className="grid grid-cols-4 gap-1.5 mb-5 text-[11px] font-mono">
        {tempos.map((t) => {
          const isSelected = t.id === activeTempo.id;
          const isShower = t.phaseType === "shower";
          return (
            <button
              key={t.id}
              onClick={() => onSelectTempo(t.id)}
              className={`p-2 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-slate-900/95 shadow-lg scale-[1.01]"
                  : "bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100"
              }`}
              style={
                isSelected
                  ? {
                      borderColor: isShower ? "#A855F7" : accentColor,
                      boxShadow: `0 0 18px -4px ${
                        isShower ? "rgba(168,85,247,0.45)" : `${accentColor}45`
                      }`,
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className="font-bold tracking-wider text-[10px]"
                  style={{ color: isShower ? "#C084FC" : accentColor }}
                >
                  {t.tempoNumber}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.durationMinutes}m
                </span>
              </div>
              <div className="text-white font-sans font-semibold text-xs truncate mt-0.5">
                {t.startTime}–{t.endTime}
              </div>
              <div className="text-[10px] text-slate-400 font-sans truncate">
                {isShower ? "🚿 Ducha Express" : t.title.split("·")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Tempo Chronometer Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-950/80 border border-slate-800/90 rounded-xl p-4">
        <div className="lg:col-span-5 flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center border shrink-0 relative"
            style={{
              borderColor: `${activeTempo.accentColor}66`,
              background: `radial-gradient(circle at center, ${activeTempo.accentColor}22 0%, rgba(5,8,17,0.95) 100%)`,
            }}
          >
            <span className="font-mono text-2xl font-bold text-white tracking-tight">
              {formatMMSS(secondsLeft)}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              {elapsedPct}% COMPLETADO
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                style={{
                  backgroundColor: `${activeTempo.accentColor}20`,
                  color: activeTempo.accentColor,
                }}
              >
                {activeTempo.tempoNumber} · {activeTempo.startTime} A {activeTempo.endTime}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
              {activeTempo.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
              {activeTempo.description}
            </p>
          </div>
        </div>

        {/* Controls: Start/Pause Tempo + Quick Series Rest Timers */}
        <div className="lg:col-span-7 flex flex-wrap items-center justify-between lg:justify-end gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberBeep(660, 0.1, false);
                setIsRunning(!isRunning);
              }}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-950 transition shadow-md hover:brightness-110"
              style={{ backgroundColor: activeTempo.accentColor }}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Tempo</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar {activeTempo.tempoNumber}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(activeTempo.durationMinutes * 60);
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title="Reiniciar Tempo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Series Rest Quick Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyber-cyan" />
              Descanso Serie:
            </span>
            {[30, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  playCyberBeep(520, 0.08, false);
                  setRestSecondsLeft(sec);
                }}
                className={`px-2 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                  restSecondsLeft !== null && restSecondsLeft <= sec && restSecondsLeft > sec - 30
                    ? "bg-cyber-cyan text-slate-950 font-bold"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                {sec}s
              </button>
            ))}
            {restSecondsLeft !== null && (
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="ml-1 px-2.5 py-1 rounded-lg bg-cyber-orange text-slate-950 font-mono text-xs font-bold animate-pulse"
              >
                ⏱ {restSecondsLeft}s
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Strict University Deadline Strip */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Flame className="w-3.5 h-3.5" />
            08:00–09:00 Entreno (60m)
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <ShowerHead className="w-3.5 h-3.5" />
            09:00–09:10 Ducha Express (10m)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <GraduationCap className="w-3.5 h-3.5" />
            09:30 Entrada Universidad
          </span>
        </div>
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
          Eurofitness Estació del Nord
        </span>
      </div>
    </div>
  );
}
