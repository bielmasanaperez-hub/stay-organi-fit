"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Waves,
  Dribbble,
  MapPin,
  Check,
  Moon,
  Flame,
  Clock,
  Sparkles,
  Award,
} from "lucide-react";
import {
  APP_VERSION,
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
    <div className="relative min-h-screen bg-club-obsidian text-club-ivory pb-24">
      {/* SUBTLE ARCHITECTURAL AMBIENT GLOW IN BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 opacity-25"
          style={{
            backgroundImage: `url('${activeBgImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-club-obsidian/85 via-club-obsidian/92 to-club-obsidian" />
      </div>

      {/* MAIN LUXURY CLUB CONTAINER */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-7">
        {/* 1. PRIVATE ATHLETIC CLUB HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-club-gold/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-club-surface border border-club-gold/40 flex items-center justify-center text-club-gold shrink-0 shadow-lg">
              <Award className="w-6 h-6 stroke-[1.4]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.26em] text-club-gold font-semibold">
                  STAYORGANIFIT · ATHLETIC CLUB
                </span>
                <span className="px-2 py-0.5 rounded bg-club-surface border border-club-gold/30 text-[10px] font-mono text-club-goldLight">
                  {APP_VERSION}
                </span>
                <span className="text-club-muted">·</span>
                <span className="text-xs text-club-stone flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-club-gold" />
                  {EUROFITNESS_INFO.name}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-club-ivory tracking-tight mt-0.5">
                Performance Schedule & Wardrobe Concierge
              </h1>
            </div>
          </div>

          {/* Club Space Selector */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-club-stone">
              Espacio del Club:
            </span>
            <div className="inline-flex rounded-xl bg-club-carbon p-1 border border-club-gold/20 gap-1">
              <button
                onClick={() => setEnvOverride("gym")}
                className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-[0.14em] font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "gym"
                    ? "bg-club-gold text-club-obsidian font-semibold shadow"
                    : "text-club-stone hover:text-club-ivory"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Fitness Studio</span>
              </button>
              <button
                onClick={() => setEnvOverride("pool")}
                className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-[0.14em] font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "pool"
                    ? "bg-club-gold text-club-obsidian font-semibold shadow"
                    : "text-club-stone hover:text-club-ivory"
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>25m Pool & Spa</span>
              </button>
              <button
                onClick={() => setEnvOverride("basket")}
                className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-[0.14em] font-medium flex items-center gap-1.5 transition ${
                  currentEnvironment === "basket"
                    ? "bg-club-gold text-club-obsidian font-semibold shadow"
                    : "text-club-stone hover:text-club-ivory"
                }`}
              >
                <Dribbble className="w-3.5 h-3.5" />
                <span>Hardwood Court</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. EDITORIAL WEEKLY SCHEDULE RIBBON (LUNES A VIERNES) */}
        <section className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
          {ORDERED_DAYS.map((dId, idx) => {
            const d = WEEKLY_EUROFITNESS_PLAN[dId];
            const isSelected = dId === selectedDayId;
            const isToday = dId === getTodayDayId();

            return (
              <button
                key={d.id}
                onClick={() => handleSelectDay(d.id)}
                className={`rounded-xl p-3.5 sm:p-4 text-left transition-all border relative overflow-hidden ${
                  isSelected
                    ? "bg-club-elevated border-club-gold/60 shadow-xl"
                    : "bg-club-carbon/80 border-white/10 hover:border-club-gold/30"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-club-gold" />
                )}

                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-club-gold">
                    0{idx + 1} · {d.shortName}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded bg-club-gold/20 text-club-goldLight text-[9px] uppercase tracking-widest font-semibold">
                      Hoy
                    </span>
                  )}
                </div>

                <div className="font-serif text-base sm:text-xl font-semibold text-club-ivory mt-1 truncate">
                  {d.dayName}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-club-stone">
                  {d.environment === "pool" ? (
                    <Waves className="w-3.5 h-3.5 text-club-gold shrink-0" />
                  ) : d.environment === "basket" ? (
                    <Dribbble className="w-3.5 h-3.5 text-club-gold shrink-0" />
                  ) : (
                    <Dumbbell className="w-3.5 h-3.5 text-club-gold shrink-0" />
                  )}
                  <span className="truncate">
                    {d.environment === "pool"
                      ? "Piscina 25m"
                      : d.environment === "basket"
                      ? "Pista & Sala"
                      : "Fuerza & Core"}
                  </span>
                </div>

                {d.nightBasket.active && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 text-[10px] text-club-goldLight truncate">
                    <Moon className="w-3 h-3 shrink-0 text-club-gold" />
                    <span className="truncate">
                      {d.id === "miercoles"
                        ? "Noche: Físico + Básquet"
                        : "Noche: Entreno Básquet"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {/* 3. CINEMATIC MAGAZINE-STYLE HERO BANNER (EQUINOX / LUXURY CLUB STYLE) */}
        <section className="relative rounded-2xl overflow-hidden border border-club-gold/25 shadow-2xl min-h-[300px] flex flex-col justify-end">
          {/* High-Resolution Club Photography Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('${activeBgImage}')`,
            }}
          />
          {/* Rich Editorial Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-club-obsidian via-club-obsidian/75 to-club-obsidian/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-club-obsidian/90 via-club-obsidian/55 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-club-gold text-club-obsidian text-[10px] uppercase tracking-[0.2em] font-bold">
                  {dayPlan.dayName} · 08:00 – 09:00H (+ DUCHA 09:00–09:10H)
                </span>
                <span className="px-3 py-1 rounded-full bg-club-obsidian/80 backdrop-blur-md border border-club-gold/30 text-[11px] uppercase tracking-[0.14em] text-club-goldLight">
                  {dayPlan.facilityZone}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-club-ivory leading-[1.1] tracking-tight">
                {dayPlan.headline}
              </h2>

              <p className="text-xs sm:text-sm text-club-stone max-w-2xl leading-relaxed">
                {dayPlan.subtitle}
              </p>

              {/* Key Performance Metrics Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.16em] text-club-stone">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-club-gold" />
                  <strong className="text-club-ivory">60 MIN</strong> ENTRENO +{" "}
                  <strong className="text-club-ivory">10 MIN</strong> DUCHA
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-club-gold" />
                  EST. <strong className="text-club-ivory">{dayPlan.caloriesEst} KCAL</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-club-gold" />
                  CARGA: <strong className="text-club-ivory">{dayPlan.cnsLoad}</strong>
                </span>
              </div>
            </div>

            {/* Evening Basketball Load Advisory Card */}
            <div className="lg:col-span-4">
              <div className="bg-club-obsidian/85 backdrop-blur-md border border-club-gold/30 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    Básquet Equipo (Noche)
                  </span>
                  <span>CARGA {dayPlan.nightBasket.loadLevel}</span>
                </div>
                <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5 leading-snug">
                  {dayPlan.nightBasket.title}
                </p>
                <p className="text-xs text-club-stone mt-1.5 leading-relaxed">
                  {dayPlan.nightBasket.coachNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRECISION LUXURY CHRONOMETER CONSOLE */}
        <TempoChronometer
          tempos={dayPlan.tempos}
          activeTempoId={activeTempoId}
          onSelectTempo={setActiveTempoId}
        />

        {/* 5. DETAILED WORKOUT REGIMEN BY TEMPOS */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-club-gold/15 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-club-gold font-semibold block">
                PROGRAMA DE ENTRENAMIENTO · EUROFITNESS ESTACIÓ DEL NORD
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-club-ivory mt-0.5">
                Secuencia de Tempos · {dayPlan.dayName}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.16em] text-club-stone">
                Ejecución de hoy:
              </span>
              <span className="px-3.5 py-1 rounded-full bg-club-elevated border border-club-gold/35 font-mono text-xs text-club-goldLight">
                {doneExercisesCount} / {allDayExercises.length} ({workoutProgressPct}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dayPlan.tempos.map((tempo, idx) => {
              const isSelectedTempo = tempo.id === activeTempoId;
              const isShower = tempo.phaseType === "shower";

              return (
                <div
                  key={tempo.id}
                  onClick={() => setActiveTempoId(tempo.id)}
                  className={`luxury-panel rounded-2xl p-6 transition cursor-pointer relative overflow-hidden ${
                    isSelectedTempo
                      ? "border-club-gold/60 shadow-2xl"
                      : "hover:border-club-gold/30"
                  }`}
                >
                  {isSelectedTempo && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-club-gold" />
                  )}

                  <div className="flex items-baseline justify-between gap-2 pb-4 mb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-2xl font-semibold text-club-gold">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-club-gold font-semibold block">
                          {isShower ? "VESTUARIO & DUCHA EXPRESS" : `FASE ${idx + 1}`}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-club-ivory mt-0.5">
                          {tempo.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs text-club-ivory block">
                        {tempo.startTime} – {tempo.endTime}
                      </span>
                      <span className="font-mono text-[10px] text-club-stone">
                        {tempo.durationMinutes} MIN
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-club-stone mb-4 leading-relaxed">
                    {tempo.description}
                  </p>

                  <div className="space-y-3">
                    {tempo.exercises.map((ex) => {
                      const isDone = Boolean(completedExercises[ex.id]);
                      return (
                        <div
                          key={ex.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExerciseDone(ex.id);
                          }}
                          className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                            isDone
                              ? "bg-club-obsidian/50 border-club-gold/20"
                              : "luxury-subcard hover:border-club-gold/30"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition ${
                              isDone
                                ? "bg-club-gold border-club-gold text-club-obsidian"
                                : "border-club-stone/40 bg-club-obsidian"
                            }`}
                          >
                            {isDone && (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span
                                className={`text-sm font-semibold ${
                                  isDone
                                    ? "line-through text-club-muted"
                                    : "text-club-ivory"
                                }`}
                              >
                                {ex.name}
                              </span>
                              <span className="font-mono text-[11px] text-club-gold shrink-0">
                                {ex.durationMinutes} MIN
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-club-goldLight/90 font-medium">
                              <span>{ex.setsAndReps}</span>
                              {ex.restSeconds > 0 && (
                                <span className="text-club-stone">
                                  · Recuperación: {ex.restSeconds}s
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-club-stone mt-1.5 italic font-serif">
                              &ldquo;{ex.tip}&rdquo;
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

        {/* 6. LOCKER ROOM & OUTFITDIARIO CONCIERGE */}
        <OutfitDiarioBridge
          dayPlan={dayPlan}
          activeEnvironment={currentEnvironment}
        />
      </div>
    </div>
  );
}
