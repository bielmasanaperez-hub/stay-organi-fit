"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Waves,
  Dribbble,
  Clock,
  MapPin,
  Flame,
  Zap,
  ShowerHead,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Moon,
  ChevronRight,
  ShieldAlert,
  Activity,
  Calendar,
} from "lucide-react";
import {
  WEEKLY_EUROFITNESS_PLAN,
  ORDERED_DAYS,
  EUROFITNESS_INFO,
  DayId,
  EnvironmentMode,
  getTodayDayId,
} from "@/lib/eurofitness-plan";
import TempoChronometer from "@/components/TempoChronometer";
import OutfitDiarioBridge from "@/components/OutfitDiarioBridge";

export default function StayOrganiFitApp() {
  const [selectedDayId, setSelectedDayId] = useState<DayId>("lunes");
  const [envOverride, setEnvOverride] = useState<EnvironmentMode | null>(null);
  const [activeTempoId, setActiveTempoId] = useState<string>("lun-t1");
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});

  // Set current weekday automatically on mount
  useEffect(() => {
    const todayId = getTodayDayId();
    setSelectedDayId(todayId);
    setActiveTempoId(WEEKLY_EUROFITNESS_PLAN[todayId].tempos[0].id);

    if (typeof window !== "undefined") {
      const savedDone = localStorage.getItem("stayorganifit_done_exercises");
      if (savedDone) {
        try {
          setCompletedExercises(JSON.parse(savedDone));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const dayPlan = WEEKLY_EUROFITNESS_PLAN[selectedDayId];
  const currentEnvironment: EnvironmentMode =
    envOverride || dayPlan.environment;

  const activeBgImage =
    currentEnvironment === "pool"
      ? "/bg-pool.png"
      : currentEnvironment === "basket"
      ? "/bg-basket.png"
      : "/bg-gym.png";

  const activeAccentColor =
    currentEnvironment === "pool"
      ? "#00F0FF"
      : currentEnvironment === "basket"
      ? "#FF6B00"
      : "#00FF87";

  const handleSelectDay = (dayId: DayId) => {
    setSelectedDayId(dayId);
    setEnvOverride(null);
    setActiveTempoId(WEEKLY_EUROFITNESS_PLAN[dayId].tempos[0].id);
  };

  const toggleExerciseDone = (exId: string) => {
    setCompletedExercises((prev) => {
      const updated = { ...prev, [exId]: !prev[exId] };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "stayorganifit_done_exercises",
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const allDayExercises = dayPlan.tempos.flatMap((t) => t.exercises);
  const doneExercisesCount = allDayExercises.filter(
    (e) => completedExercises[e.id]
  ).length;
  const workoutProgressPct =
    allDayExercises.length > 0
      ? Math.round((doneExercisesCount / allDayExercises.length) * 100)
      : 0;

  return (
    <div className="relative min-h-screen text-slate-100 pb-20">
      {/* DYNAMIC FUTURISTIC BACKGROUND LAYER (GYM / POOL / BASKET COURT) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url('${activeBgImage}')`,
          }}
        />
        {/* Layered gradients so background sports scene shines through while keeping HUD text razor sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/75 via-[#050811]/65 to-[#050811]/95" />
        <div className="absolute inset-0 cyber-grid-overlay opacity-70" />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[260px] rounded-full blur-[130px] opacity-30 transition-all duration-700"
          style={{ backgroundColor: activeAccentColor }}
        />
      </div>

      {/* MAIN HUD CONTAINER */}
      <div className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-5">
        {/* 1. TOP FUTURISTIC NAVBAR & EUROFITNESS ESTACIÓ DEL NORD BADGE */}
        <header className="cyber-glass rounded-2xl border border-slate-800/90 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-lg"
              style={{
                borderColor: `${activeAccentColor}70`,
                background: `linear-gradient(135deg, ${activeAccentColor}25, rgba(5,8,17,0.9))`,
                color: activeAccentColor,
              }}
            >
              {currentEnvironment === "pool" ? (
                <Waves className="w-6 h-6" />
              ) : currentEnvironment === "basket" ? (
                <Dribbble className="w-6 h-6" />
              ) : (
                <Dumbbell className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyber-cyan font-bold">
                  STAYORGANIFIT · HUD v2.0
                </span>
                <span className="font-mono text-[11px] text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyber-emerald" />
                  {EUROFITNESS_INFO.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Planificador de Tempos (08:00–09:10) & OutfitDiario Sync
              </h1>
            </div>
          </div>

          {/* Environment Mode Switcher (Por si hoy quieres cambiar entre Gym, Piscina o Pista) */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Instalación Activa (Cambia fondo y Outfit Extra):
            </span>
            <div className="inline-flex rounded-xl bg-slate-950/90 p-1 border border-slate-800 gap-1">
              <button
                onClick={() => setEnvOverride("gym")}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentEnvironment === "gym"
                    ? "bg-cyber-emerald text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Gym</span>
              </button>
              <button
                onClick={() => setEnvOverride("pool")}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentEnvironment === "pool"
                    ? "bg-cyber-cyan text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Piscina</span>
              </button>
              <button
                onClick={() => setEnvOverride("basket")}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentEnvironment === "basket"
                    ? "bg-cyber-orange text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Dribbble className="w-3.5 h-3.5" />
                <span>Pista Básquet</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. SELECTOR DE DÍAS: LUNES A VIERNES (CON ALERTAS DE BÁSQUET NOCTURNO MIÉRCOLES Y VIERNES) */}
        <section className="grid grid-cols-5 gap-2 sm:gap-3">
          {ORDERED_DAYS.map((dId) => {
            const d = WEEKLY_EUROFITNESS_PLAN[dId];
            const isSelected = dId === selectedDayId;
            const isToday = dId === getTodayDayId();

            return (
              <button
                key={d.id}
                onClick={() => handleSelectDay(d.id)}
                className={`rounded-2xl p-2.5 sm:p-3.5 border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "cyber-glass scale-[1.02] shadow-xl"
                    : "bg-slate-950/75 border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: d.themeAccent.primary,
                        boxShadow: `0 0 24px -6px ${d.themeAccent.glow}`,
                      }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                    {d.shortName}
                  </span>
                  {isToday && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-950"
                      style={{ backgroundColor: d.themeAccent.primary }}
                    >
                      HOY
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex items-center gap-1.5">
                  {d.environment === "pool" ? (
                    <Waves
                      className="w-4 h-4 shrink-0"
                      style={{ color: d.themeAccent.primary }}
                    />
                  ) : d.environment === "basket" ? (
                    <Dribbble
                      className="w-4 h-4 shrink-0"
                      style={{ color: d.themeAccent.primary }}
                    />
                  ) : (
                    <Dumbbell
                      className="w-4 h-4 shrink-0"
                      style={{ color: d.themeAccent.primary }}
                    />
                  )}
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {d.environment === "pool"
                      ? "Piscina"
                      : d.environment === "basket"
                      ? "Pista+Gym"
                      : "Gym Fuerza"}
                  </span>
                </div>

                <p className="hidden sm:block text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {d.headline}
                </p>

                {/* Night Basketball Indicator for Wednesday & Friday */}
                {d.nightBasket.active && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/90 flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-cyber-orange font-semibold truncate">
                    <Moon className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {d.id === "miercoles"
                        ? "Noche: 40m Físico + 1h15 Básquet"
                        : "Noche: 1h15 Básquet"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {/* 3. HERO DEL DÍA ACTUAL + CONDICIONANTE DE BÁSQUET NOCTURNO */}
        <section
          className="cyber-glass rounded-2xl border p-5 relative overflow-hidden"
          style={{ borderColor: `${activeAccentColor}50` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-md font-mono text-xs font-bold uppercase text-slate-950"
                  style={{ backgroundColor: activeAccentColor }}
                >
                  {dayPlan.dayName} · 08:00 – 09:00H (+ DUCHA 09:00–09:10H)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 font-mono text-xs text-slate-200">
                  📍 {dayPlan.facilityZone}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 font-mono text-xs text-cyber-cyan">
                  Carga SNC: {dayPlan.cnsLoad}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {dayPlan.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dayPlan.subtitle}
              </p>
            </div>

            {/* Right Stats + Night Basket Alert Box */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <div
                className={`p-3.5 rounded-xl border ${
                  dayPlan.nightBasket.active
                    ? "bg-orange-950/40 border-cyber-orange/60"
                    : "bg-slate-950/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-cyber-orange flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    CONDICIONANTE EQUIPO BÁSQUET (NOCHE)
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      dayPlan.nightBasket.active
                        ? "bg-cyber-orange text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    CARGA {dayPlan.nightBasket.loadLevel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white mt-1">
                  {dayPlan.nightBasket.title}
                </p>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {dayPlan.nightBasket.coachNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CRONÓMETRO INTERACTIVO DE TEMPOS (08:00 - 09:00 ENTRENO | 09:00 - 09:10 DUCHA | 09:30 UNI) */}
        <TempoChronometer
          tempos={dayPlan.tempos}
          activeTempoId={activeTempoId}
          onSelectTempo={setActiveTempoId}
          accentColor={activeAccentColor}
        />

        {/* 5. DESGLOSE DE EJERCICIOS POR TEMPOS CON CHECKLIST EN TIEMPO REAL */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <Activity
                className="w-5 h-5"
                style={{ color: activeAccentColor }}
              />
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide font-mono">
                Hoja de Ruta por Tempos · {dayPlan.dayName} (08:00 a 09:10h)
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Progreso de hoy:</span>
              <span
                className="px-2.5 py-0.5 rounded-full font-bold text-slate-950"
                style={{ backgroundColor: activeAccentColor }}
              >
                {doneExercisesCount}/{allDayExercises.length} bloques (
                {workoutProgressPct}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayPlan.tempos.map((tempo) => {
              const isSelectedTempo = tempo.id === activeTempoId;
              const isShowerTempo = tempo.phaseType === "shower";

              return (
                <div
                  key={tempo.id}
                  onClick={() => setActiveTempoId(tempo.id)}
                  className={`cyber-glass rounded-2xl border p-4 sm:p-5 transition cursor-pointer ${
                    isSelectedTempo
                      ? "ring-1"
                      : "border-slate-800/90 hover:border-slate-700"
                  }`}
                  style={
                    isSelectedTempo
                      ? {
                          borderColor: tempo.accentColor,
                          boxShadow: `0 0 25px -8px ${tempo.accentColor}50`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-slate-950"
                        style={{ backgroundColor: tempo.accentColor }}
                      >
                        {tempo.tempoNumber}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {tempo.startTime} – {tempo.endTime}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      ⏱ {tempo.durationMinutes} min exactos
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {tempo.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-3">
                    {tempo.description}
                  </p>

                  <div className="space-y-2.5">
                    {tempo.exercises.map((ex) => {
                      const isDone = Boolean(completedExercises[ex.id]);
                      return (
                        <div
                          key={ex.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExerciseDone(ex.id);
                          }}
                          className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                            isDone
                              ? "bg-emerald-950/25 border-emerald-500/40"
                              : "bg-slate-950/85 border-slate-800/90 hover:border-slate-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                              isDone
                                ? "bg-cyber-emerald border-cyber-emerald text-slate-950"
                                : "border-slate-600 bg-slate-900"
                            }`}
                          >
                            {isDone && (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span
                                className={`text-xs sm:text-sm font-bold ${
                                  isDone
                                    ? "line-through text-slate-400"
                                    : "text-white"
                                }`}
                              >
                                {ex.name}
                              </span>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyber-cyan">
                                {ex.durationMinutes} min
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-slate-300">
                              <span>📊 {ex.setsAndReps}</span>
                              {ex.restSeconds > 0 && (
                                <span className="text-cyber-orange">
                                  · Descanso: {ex.restSeconds}s
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1">
                              💡 {ex.tip}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CONEXIÓN EN VIVO CON OUTFITDIARIO (OUTFIT EXTRA DEPORTIVO + DUCHA 9:00-9:10 + BÁSQUET NOCHE) */}
        <OutfitDiarioBridge
          dayPlan={dayPlan}
          activeEnvironment={currentEnvironment}
          accentColor={activeAccentColor}
        />
      </div>
    </div>
  );
}
