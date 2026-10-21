"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Waves,
  Dribbble,
  MapPin,
  CheckCircle2,
  Moon,
  Activity,
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

  // Colores suaves y agradables a la vista
  const activeAccentColor =
    currentEnvironment === "pool"
      ? "#38bdf8" // Azul cielo suave
      : currentEnvironment === "basket"
      ? "#f59e0b" // Ámbar cálido
      : "#34d399"; // Verde menta/esmeralda suave

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
      {/* FONDO DEPORTIVO SUAVE Y CÓMODO A LA VISTA */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-20 blur-[2px] saturate-50"
          style={{
            backgroundImage: `url('${activeBgImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#11161f]/85 via-[#11161f]/90 to-[#11161f]" />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-5">
        {/* 1. CABECERA LIMPIA */}
        <header className="clean-card rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${activeAccentColor}20`,
                color: activeAccentColor,
              }}
            >
              {currentEnvironment === "pool" ? (
                <Waves className="w-5 h-5" />
              ) : currentEnvironment === "basket" ? (
                <Dribbble className="w-5 h-5" />
              ) : (
                <Dumbbell className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  StayOrganiFit
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {EUROFITNESS_INFO.name}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Horario Deportivo (08:00–09:10) y OutfitDiario
              </h1>
            </div>
          </div>

          {/* Selector de instalación */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-xs text-slate-400">
              Instalación de hoy:
            </span>
            <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 gap-1">
              <button
                onClick={() => setEnvOverride("gym")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "gym"
                    ? "bg-emerald-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Gym</span>
              </button>
              <button
                onClick={() => setEnvOverride("pool")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "pool"
                    ? "bg-sky-400 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Piscina</span>
              </button>
              <button
                onClick={() => setEnvOverride("basket")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "basket"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Dribbble className="w-3.5 h-3.5" />
                <span>Pista Básquet</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. SELECTOR DE DÍAS (LUNES A VIERNES) */}
        <section className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {ORDERED_DAYS.map((dId) => {
            const d = WEEKLY_EUROFITNESS_PLAN[dId];
            const isSelected = dId === selectedDayId;
            const isToday = dId === getTodayDayId();

            const dayColor =
              d.environment === "pool"
                ? "#38bdf8"
                : d.environment === "basket"
                ? "#f59e0b"
                : "#34d399";

            return (
              <button
                key={d.id}
                onClick={() => handleSelectDay(d.id)}
                className={`rounded-xl p-2.5 sm:p-3.5 border text-left transition-all ${
                  isSelected
                    ? "bg-slate-800/95 border-slate-500 shadow-md"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-200">
                    {d.dayName}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-white">
                      Hoy
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex items-center gap-1.5">
                  {d.environment === "pool" ? (
                    <Waves
                      className="w-4 h-4 shrink-0"
                      style={{ color: dayColor }}
                    />
                  ) : d.environment === "basket" ? (
                    <Dribbble
                      className="w-4 h-4 shrink-0"
                      style={{ color: dayColor }}
                    />
                  ) : (
                    <Dumbbell
                      className="w-4 h-4 shrink-0"
                      style={{ color: dayColor }}
                    />
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    {d.environment === "pool"
                      ? "Piscina"
                      : d.environment === "basket"
                      ? "Pista + Gym"
                      : "Gym"}
                  </span>
                </div>

                {d.nightBasket.active && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center gap-1 text-[10px] text-amber-400 truncate">
                    <Moon className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {d.id === "miercoles"
                        ? "Noche: Físico + Básquet"
                        : "Noche: Básquet"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {/* 3. RESUMEN DEL DÍA Y ENTRENO DE BÁSQUET POR LA NOCHE */}
        <section className="clean-card rounded-2xl p-5 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-2.5 py-1 rounded-lg font-semibold text-slate-950"
                  style={{ backgroundColor: activeAccentColor }}
                >
                  {dayPlan.dayName} · 08:00 a 09:00h (Ducha 09:00–09:10h)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                  {dayPlan.facilityZone}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white">
                {dayPlan.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dayPlan.subtitle}
              </p>
            </div>

            <div className="lg:col-span-4">
              <div
                className={`p-3.5 rounded-xl border ${
                  dayPlan.nightBasket.active
                    ? "bg-amber-950/25 border-amber-500/40"
                    : "bg-slate-900/70 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    Equipo de Básquet (Noche)
                  </span>
                  <span className="text-slate-400">
                    Carga {dayPlan.nightBasket.loadLevel.toLowerCase()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                  {dayPlan.nightBasket.title}
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {dayPlan.nightBasket.coachNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CRONÓMETRO DE TEMPOS */}
        <TempoChronometer
          tempos={dayPlan.tempos}
          activeTempoId={activeTempoId}
          onSelectTempo={setActiveTempoId}
          accentColor={activeAccentColor}
        />

        {/* 5. BLOQUES DE EJERCICIOS POR TIEMPOS */}
        <section className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <Activity
                className="w-5 h-5"
                style={{ color: activeAccentColor }}
              />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Entrenamiento por Tempos · {dayPlan.dayName}
              </h2>
            </div>
            <span className="text-xs text-slate-300 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full">
              Completado: {doneExercisesCount}/{allDayExercises.length} (
              {workoutProgressPct}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayPlan.tempos.map((tempo, idx) => {
              const isSelectedTempo = tempo.id === activeTempoId;
              const isShower = tempo.phaseType === "shower";

              return (
                <div
                  key={tempo.id}
                  onClick={() => setActiveTempoId(tempo.id)}
                  className={`clean-card rounded-2xl p-4 sm:p-5 transition cursor-pointer ${
                    isSelectedTempo
                      ? "ring-1 ring-slate-500"
                      : "hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold text-slate-950"
                        style={{ backgroundColor: activeAccentColor }}
                      >
                        {isShower ? "Ducha" : `Tempo ${idx + 1}`}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {tempo.startTime} – {tempo.endTime}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {tempo.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {tempo.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 mb-3">
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
                              ? "bg-slate-800/40 border-slate-700/50"
                              : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                              isDone
                                ? "bg-emerald-500 border-emerald-500 text-slate-950"
                                : "border-slate-600 bg-slate-800"
                            }`}
                          >
                            {isDone && (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span
                                className={`text-xs sm:text-sm font-semibold ${
                                  isDone
                                    ? "line-through text-slate-400"
                                    : "text-white"
                                }`}
                              >
                                {ex.name}
                              </span>
                              <span className="text-xs text-slate-400">
                                {ex.durationMinutes} min
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                              <span>{ex.setsAndReps}</span>
                              {ex.restSeconds > 0 && (
                                <span className="text-slate-400">
                                  · Descanso: {ex.restSeconds}s
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 mt-1">
                              {ex.tip}
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

        {/* 6. CONEXIÓN CON OUTFITDIARIO */}
        <OutfitDiarioBridge
          dayPlan={dayPlan}
          activeEnvironment={currentEnvironment}
          accentColor={activeAccentColor}
        />
      </div>
    </div>
  );
}
