"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Waves,
  Dribbble,
  MapPin,
  Check,
  Moon,
  Clock,
  Sparkles,
  ArrowRight,
  Backpack,
  Play,
  Pause,
  RotateCcw,
  ShowerHead,
  GraduationCap,
  Shirt,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
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

type ActiveStep = "step1_bag" | "step2_workout" | "step3_shower";

export default function StayOrganiFitApp() {
  const [selectedDayId, setSelectedDayId] = useState<DayId>("lunes");
  const [activeStep, setActiveStep] = useState<ActiveStep>("step1_bag");
  const [activeTempoIndex, setActiveTempoIndex] = useState<number>(0);

  // Estados interactivos
  const [checkedBagItems, setCheckedBagItems] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(8 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [washSent, setWashSent] = useState<boolean>(false);
  const [sendingWash, setSendingWash] = useState<boolean>(false);

  // Inicializar día actual
  useEffect(() => {
    const today = getTodayDayId();
    setSelectedDayId(today);

    // Cargar mochila guardada si existe
    if (typeof window !== "undefined") {
      const savedBag = localStorage.getItem(`stayorganifit_bag_${today}`);
      if (savedBag) {
        try {
          setCheckedBagItems(JSON.parse(savedBag));
        } catch {
          // ignore
        }
      }
      const savedEx = localStorage.getItem(`stayorganifit_ex_${today}`);
      if (savedEx) {
        try {
          setCompletedExercises(JSON.parse(savedEx));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const dayPlan = WEEKLY_EUROFITNESS_PLAN[selectedDayId];
  const workoutTempos = dayPlan.tempos.filter((t) => t.phaseType !== "shower");
  const currentTempo = workoutTempos[activeTempoIndex] || workoutTempos[0];

  // Sincronizar temporizador al cambiar de fase
  useEffect(() => {
    setTimerRunning(false);
    if (activeStep === "step3_shower") {
      setSecondsLeft(10 * 60); // 10 min de ducha
    } else if (currentTempo) {
      setSecondsLeft(currentTempo.durationMinutes * 60);
    }
  }, [currentTempo, activeStep, selectedDayId]);

  // Cuenta atrás del temporizador
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Temporizador de descanso
  useEffect(() => {
    if (restSeconds === null) return;
    if (restSeconds <= 0) {
      setRestSeconds(null);
      return;
    }
    const t = setTimeout(() => {
      setRestSeconds((r) => (r !== null ? r - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [restSeconds]);

  const handleSelectDay = (dayId: DayId) => {
    setSelectedDayId(dayId);
    setActiveStep("step1_bag");
    setActiveTempoIndex(0);
    setWashSent(false);
  };

  const toggleBagItem = (id: string) => {
    setCheckedBagItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem(`stayorganifit_bag_${selectedDayId}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem(`stayorganifit_ex_${selectedDayId}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSendToWash = async () => {
    setSendingWash(true);
    try {
      await fetch("/api/outfit-diario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayId: selectedDayId,
          environment: dayPlan.environment,
        }),
      });
      setWashSent(true);
    } catch {
      setWashSent(true);
    } finally {
      setSendingWash(false);
    }
  };

  const formatMMSS = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const bagItems = dayPlan.extraOutfitPack.items;
  const bagDoneCount = bagItems.filter((i) => checkedBagItems[i.id]).length;
  const isBagComplete = bagDoneCount === bagItems.length;

  const currentExercises = currentTempo?.exercises || [];
  const currentExercisesDone = currentExercises.filter((e) => completedExercises[e.id]).length;

  return (
    <div className="min-h-screen bg-[#0E1015] text-[#F3F4F6] pb-24 font-sans">
      {/* 1. CABECERA LIMPIA Y ORIENTATIVA */}
      <header className="bg-[#141820] border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] font-serif font-bold text-lg">
              SO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-semibold">
                  StayOrganiFit
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                Eurofitness Estació del Nord · Lunes a Viernes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-[#C8A97E]" />
            <span>08:00 – 09:00 Gym · 09:10 Ducha · 09:30 Uni</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* 2. SELECTOR DE DÍA DE LA SEMANA */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Elige el día de entrenamiento:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ORDERED_DAYS.map((dId) => {
              const d = WEEKLY_EUROFITNESS_PLAN[dId];
              const isSelected = dId === selectedDayId;
              const isToday = dId === getTodayDayId();

              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDay(d.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-[#C8A97E] text-[#0E1015] border-[#C8A97E] font-bold shadow-md"
                      : "bg-[#161B24] border-white/10 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wider">
                    {d.shortName}
                    {isToday && " • HOY"}
                  </div>
                  <div className="text-sm font-semibold truncate mt-0.5">
                    {d.environment === "pool"
                      ? "Piscina"
                      : d.environment === "basket"
                      ? "Pista Básquet"
                      : "Gym"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. RESUMEN DEL DÍA SELECCIONADO (CON ALERTA DE BÁSQUET SI TOCA HOY) */}
        <div className="bg-[#161B24] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-semibold block">
                {dayPlan.dayName.toUpperCase()} EN EUROFITNESS ESTACIÓ DEL NORD
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {dayPlan.headline}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                📍 {dayPlan.facilityZone}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200">
                ⏱ 08:00 a 09:10h
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200">
                🔥 ~{dayPlan.caloriesEst} kcal
              </span>
            </div>
          </div>

          {/* Alerta si es Miércoles o Viernes por el entreno de Básquet por la noche */}
          {dayPlan.nightBasket.active && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#2A1E14] border border-[#C8A97E]/40 flex items-start gap-3">
              <Moon className="w-5 h-5 text-[#C8A97E] shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-[#DFC6A2] block">
                  Aviso para hoy: {dayPlan.nightBasket.title}
                </strong>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {dayPlan.nightBasket.coachNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. ASISTENTE GUIADO PASO A PASO (EL NÚCLEO ORIENTATIVO) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sigue estos 3 pasos en orden:
            </span>
          </div>

          {/* Stepper de 3 Pasos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
            <button
              onClick={() => setActiveStep("step1_bag")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeStep === "step1_bag"
                  ? "bg-[#1E2532] border-[#C8A97E] shadow-md ring-1 ring-[#C8A97E]"
                  : "bg-[#161B24] border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C8A97E]">PASO 1</span>
                <span className="text-[11px] text-slate-400">07:45h</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1">
                Preparar Mochila
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {bagDoneCount} de {bagItems.length} cosas listas
              </div>
            </button>

            <button
              onClick={() => setActiveStep("step2_workout")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeStep === "step2_workout"
                  ? "bg-[#1E2532] border-[#C8A97E] shadow-md ring-1 ring-[#C8A97E]"
                  : "bg-[#161B24] border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C8A97E]">PASO 2</span>
                <span className="text-[11px] text-slate-400">08:00 – 09:00h</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1">
                Entrenar por Tempos
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {workoutTempos[activeTempoIndex]?.title.split("·")[0] || "60 min"}
              </div>
            </button>

            <button
              onClick={() => setActiveStep("step3_shower")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeStep === "step3_shower"
                  ? "bg-[#1E2532] border-[#C8A97E] shadow-md ring-1 ring-[#C8A97E]"
                  : "bg-[#161B24] border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C8A97E]">PASO 3</span>
                <span className="text-[11px] text-slate-400">09:00 – 09:10h</span>
              </div>
              <div className="font-semibold text-white text-sm mt-1">
                Ducha Express & Uni
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Cambio a Outfit Uni (09:30h)
              </div>
            </button>
          </div>

          {/* CONTENIDO DEL PASO 1: ANTES DE SALIR DE CASA (MOCHILA & ROPA) */}
          {activeStep === "step1_bag" && (
            <div className="bg-[#161B24] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-semibold block">
                  PASO 1 · ANTES DE SALIR DE CASA (07:45H)
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Qué meter en la mochila para hoy ({dayPlan.dayName})
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Marca cada elemento conforme lo metas en la mochila para no olvidarte nada en casa:
                </p>
              </div>

              <div className="space-y-2.5">
                {bagItems.map((item) => {
                  const isChecked = Boolean(checkedBagItems[item.id]);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleBagItem(item.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3.5 transition ${
                        isChecked
                          ? "bg-white/5 border-[#C8A97E]/40 text-slate-400"
                          : "bg-[#1B212D] border-white/10 hover:border-white/25 text-white"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isChecked
                            ? "bg-[#C8A97E] border-[#C8A97E] text-[#0E1015]"
                            : "border-slate-500 bg-black/30"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-semibold ${
                            isChecked ? "line-through text-slate-400" : "text-white"
                          }`}
                        >
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.reason}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
                <span className="text-xs text-slate-400">
                  {bagDoneCount} de {bagItems.length} cosas preparadas en la mochila.
                </span>

                <button
                  onClick={() => setActiveStep("step2_workout")}
                  className="px-6 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#DFC6A2] text-[#0E1015] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Mochila lista · Ir a Entrenar (Paso 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CONTENIDO DEL PASO 2: EN EUROFITNESS (08:00 - 09:00H) */}
          {activeStep === "step2_workout" && (
            <div className="bg-[#161B24] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-semibold block">
                    PASO 2 · EN EUROFITNESS ESTACIÓ DEL NORD (08:00 – 09:00H)
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Entrenamiento dividido en 3 Tempos
                  </h2>
                </div>
                <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                  Total sesión: 60 minutos
                </span>
              </div>

              {/* Selector de Tempo dentro del Paso 2 */}
              <div className="grid grid-cols-3 gap-2">
                {workoutTempos.map((t, idx) => {
                  const isCurrent = idx === activeTempoIndex;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTempoIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition ${
                        isCurrent
                          ? "bg-[#C8A97E] text-[#0E1015] border-[#C8A97E] font-bold shadow-md"
                          : "bg-[#1B212D] border-white/10 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wider">
                        TEMPO {idx + 1} ({t.durationMinutes}m)
                      </div>
                      <div className="text-sm font-semibold truncate mt-0.5">
                        {t.startTime} – {t.endTime}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Cronómetro y temporizador de descanso */}
              <div className="bg-[#12151C] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-[#C8A97E]/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-white font-mono">
                      {formatMMSS(secondsLeft)}
                    </span>
                    <span className="text-[10px] text-slate-400">Restante</span>
                  </div>

                  <div>
                    <span className="text-xs text-[#C8A97E] font-semibold block uppercase tracking-wider">
                      TEMPO {activeTempoIndex + 1} ({currentTempo.startTime} a {currentTempo.endTime})
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {currentTempo.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-lg">
                      {currentTempo.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#DFC6A2] text-[#0E1015] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Empezar Tempo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(currentTempo.durationMinutes * 60);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Pausas entre series */}
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-xs">
                    <span className="text-slate-400 text-[11px] mr-1">Descanso:</span>
                    {[30, 60, 90].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setRestSeconds(sec)}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs"
                      >
                        {sec}s
                      </button>
                    ))}
                    {restSeconds !== null && (
                      <span className="ml-1 px-2 py-0.5 rounded bg-[#C8A97E] text-[#0E1015] font-bold font-mono">
                        {restSeconds}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ejercicios del Tempo actual con casillas de verificación */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Ejercicios de este Tempo ({currentExercisesDone}/{currentExercises.length} hechos):
                </span>

                <div className="space-y-2.5">
                  {currentExercises.map((ex) => {
                    const isDone = Boolean(completedExercises[ex.id]);
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleExercise(ex.id)}
                        className={`p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${
                          isDone
                            ? "bg-white/5 border-[#C8A97E]/30 text-slate-400"
                            : "bg-[#1B212D] border-white/10 hover:border-white/20 text-white"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                            isDone
                              ? "bg-[#C8A97E] border-[#C8A97E] text-[#0E1015]"
                              : "border-slate-500 bg-black/30"
                          }`}
                        >
                          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-sm font-bold ${
                                isDone ? "line-through text-slate-400" : "text-white"
                              }`}
                            >
                              {ex.name}
                            </span>
                            <span className="text-xs font-mono text-[#C8A97E]">
                              {ex.durationMinutes} min
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                            <span className="font-semibold">{ex.setsAndReps}</span>
                            {ex.restSeconds > 0 && (
                              <span className="text-slate-400">
                                · Descanso serie: {ex.restSeconds}s
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 mt-1 italic">
                            💡 {ex.tip}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón para pasar a la ducha */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Son las 09:00h? Toca ir al vestuario para no llegar tarde a clase.
                </div>

                <button
                  onClick={() => setActiveStep("step3_shower")}
                  className="px-6 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#DFC6A2] text-[#0E1015] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <ShowerHead className="w-4 h-4" />
                  <span>Entreno terminado · Ir a la Ducha (Paso 3)</span>
                </button>
              </div>
            </div>
          )}

          {/* CONTENIDO DEL PASO 3: DUCHA EXPRESS (09:00 - 09:10H) & RUMBO A LA UNI */}
          {activeStep === "step3_shower" && (
            <div className="bg-[#161B24] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-semibold block">
                  PASO 3 · VESTUARIO EUROFITNESS (09:00 – 09:10H)
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Ducha Express (10 min) & Cambio al Outfit de Universidad
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Salida límite del vestuario a las <strong>09:10h</strong> para llegar a las <strong>09:30h</strong> a clase.
                </p>
              </div>

              {/* Temporizador de Ducha de 10 minutos */}
              <div className="bg-[#12151C] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/40 flex flex-col items-center justify-center text-[#C8A97E] shrink-0 font-mono text-xl font-bold">
                    {formatMMSS(secondsLeft)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Cronómetro Ducha Express & Vestirse
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      4 min ducha + 6 min secarse y vestirse la ropa de Universidad
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#DFC6A2] text-[#0E1015] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{timerRunning ? "Pausar" : "Iniciar Ducha (10 min)"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(10 * 60);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Botón 1-Clic: Enviar Ropa Deportiva a Lavado en OutfitDiario */}
              <div className="bg-[#1B212D] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Sincronización con OutfitDiario
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-md">
                    Marca como usada la ropa deportiva de hoy para que pase a lavado (5 días) en tu armario de OutfitDiario.
                  </p>
                </div>

                <button
                  onClick={handleSendToWash}
                  disabled={sendingWash || washSent}
                  className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    washSent
                      ? "bg-emerald-600 text-white"
                      : "bg-[#C8A97E] hover:bg-[#DFC6A2] text-[#0E1015]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {sendingWash
                      ? "Enviando..."
                      : washSent
                      ? "¡Ropa deportiva enviada a lavar!"
                      : "Enviar ropa deportiva a lavar (5 días)"}
                  </span>
                </button>
              </div>

              {/* Resumen de llegada a clase */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#C8A97E]" />
                  <span>
                    <strong>09:10h:</strong> Salida por la puerta de Eurofitness ➔ <strong>09:30h:</strong> Entrada a la Universidad
                  </span>
                </div>

                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C8A97E] hover:underline flex items-center gap-1 shrink-0 font-semibold"
                >
                  <span>Abrir OutfitDiario</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
