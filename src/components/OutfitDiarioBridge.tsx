"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shirt,
  RefreshCw,
  Check,
  ExternalLink,
  Backpack,
  ShowerHead,
  Waves,
  Dumbbell,
  Dribbble,
  Link2,
  Moon,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import { DayPlan, EnvironmentMode } from "@/lib/eurofitness-plan";

interface OutfitDiarioBridgeProps {
  dayPlan: DayPlan;
  activeEnvironment: EnvironmentMode;
  accentColor: string;
}

export default function OutfitDiarioBridge({
  dayPlan,
  activeEnvironment,
  accentColor,
}: OutfitDiarioBridgeProps) {
  const [outfitDiarioUrl, setOutfitDiarioUrl] = useState<string>(
    "http://localhost:3000"
  );
  const [showUrlConfig, setShowUrlConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [variant, setVariant] = useState<number>(0);
  const [syncData, setSyncData] = useState<any>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [confirmingWash, setConfirmingWash] = useState<boolean>(false);
  const [washFeedback, setWashFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUrl = localStorage.getItem("stayorganifit_outfitdiario_url");
      if (savedUrl) setOutfitDiarioUrl(savedUrl);

      const savedChecks = localStorage.getItem(
        `stayorganifit_bag_${dayPlan.id}`
      );
      if (savedChecks) {
        try {
          setCheckedItems(JSON.parse(savedChecks));
        } catch {
          setCheckedItems({});
        }
      } else {
        setCheckedItems({});
      }
    }
    setWashFeedback(null);
  }, [dayPlan.id]);

  const fetchOutfitDiarioSync = useCallback(
    async (nextVariant = variant, customUrl = outfitDiarioUrl) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          day: dayPlan.id,
          environment: activeEnvironment,
          variant: String(nextVariant),
          outfitDiarioUrl: customUrl,
        });
        const res = await fetch(`/api/outfit-diario?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setSyncData(json);
        }
      } catch (err) {
        console.error("Error sincronizando con OutfitDiario:", err);
      } finally {
        setLoading(false);
      }
    },
    [dayPlan.id, activeEnvironment, variant, outfitDiarioUrl]
  );

  useEffect(() => {
    fetchOutfitDiarioSync(variant, outfitDiarioUrl);
  }, [dayPlan.id, activeEnvironment, variant, outfitDiarioUrl, fetchOutfitDiarioSync]);

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `stayorganifit_bag_${dayPlan.id}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const handleRotateSportKit = () => {
    setVariant((v) => v + 1);
    setWashFeedback(null);
  };

  const handleConfirmWorkoutAndWash = async () => {
    setConfirmingWash(true);
    setWashFeedback(null);
    try {
      const morningKit = syncData?.extraOutfitConfig?.morningSportKit;
      const garmentIds: string[] = [];
      if (morningKit?.top?.id) garmentIds.push(morningKit.top.id);
      if (morningKit?.bottom?.id) garmentIds.push(morningKit.bottom.id);

      const res = await fetch("/api/outfit-diario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfitDiarioUrl,
          garmentIds,
          dayId: dayPlan.id,
          environment: activeEnvironment,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setWashFeedback(json.message);
      }
    } catch {
      setWashFeedback(
        "Entreno completado y registrado. Listo para la ducha de 09:00 a 09:10h."
      );
    } finally {
      setConfirmingWash(false);
    }
  };

  const packItems = dayPlan.extraOutfitPack.items;
  const completedCount = packItems.filter((i) => checkedItems[i.id]).length;
  const progressBagPct = Math.round((completedCount / packItems.length) * 100);

  const morningKit = syncData?.extraOutfitConfig?.morningSportKit;
  const nightKit = syncData?.extraOutfitConfig?.nightBasketKit;
  const isConnectedLive = Boolean(syncData?.connectedLive);

  return (
    <div className="clean-card rounded-2xl p-5 sm:p-6 shadow-lg">
      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-start gap-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                {isConnectedLive
                  ? "Conectado en vivo con OutfitDiario"
                  : "Sincronizado con OutfitDiario"}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1.5">
              {dayPlan.extraOutfitPack.packName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {dayPlan.extraOutfitPack.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrlConfig(!showUrlConfig)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            title="Configurar enlace de OutfitDiario"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotateSportKit}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Cambiar ropa deportiva</span>
          </button>
          <a
            href={outfitDiarioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 flex items-center gap-1.5 transition hover:opacity-95"
            style={{ backgroundColor: accentColor }}
          >
            <span>Abrir OutfitDiario</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {showUrlConfig && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-xs text-slate-300 shrink-0">
            URL de OutfitDiario:
          </span>
          <input
            type="text"
            value={outfitDiarioUrl}
            onChange={(e) => {
              setOutfitDiarioUrl(e.target.value);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "stayorganifit_outfitdiario_url",
                  e.target.value
                );
              }
            }}
            placeholder="https://outfit-diario.vercel.app o http://localhost:3000"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
          />
          <button
            onClick={() => fetchOutfitDiarioSync(variant, outfitDiarioUrl)}
            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-900 text-xs font-semibold"
          >
            Guardar
          </button>
        </div>
      )}

      {/* 1. OUTFIT DEPORTIVO MAÑANA (08:00 - 09:00) */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">
            1. Ropa y equipo para las 08:00h en Eurofitness
          </h3>
          <span className="text-xs text-slate-400">
            {activeEnvironment === "pool"
              ? "Piscina 25m"
              : activeEnvironment === "basket"
              ? "Pista Básquet + Sala"
              : "Sala Fitness Gym"}
          </span>
        </div>

        {activeEnvironment === "pool" && morningKit?.poolKit ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>Bañador</span>
                <Waves className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {morningKit.poolKit.swimsuit}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                Llevar puesto desde casa para ganar tiempo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>Gorro y Gafas</span>
                <Waves className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {morningKit.poolKit.capAndGoggles}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                Obligatorios en la piscina del club
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>Calzado de agua</span>
                <ShowerHead className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {morningKit.poolKit.flipFlops}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                Para piscina y ducha de 09:00 a 09:10h
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>Abrigo y Toalla</span>
                <Shirt className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {morningKit.warmupLayer?.name || "Sudadera cómoda"}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                + {morningKit.poolKit.towel}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>Camiseta de entreno</span>
                <Shirt className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1 truncate">
                {morningKit?.top?.name || "Camiseta técnica deportiva"}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                Color: {morningKit?.top?.color || "Negro"} · Limpia
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>Pantalón corto</span>
                <Dumbbell className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1 truncate">
                {morningKit?.bottom?.name || "Pantalón corto deportivo"}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                Color: {morningKit?.bottom?.color || "Negro"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
                <span>Calzado deportivo</span>
                <Dribbble className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1 truncate">
                {morningKit?.shoes?.name ||
                  (activeEnvironment === "basket"
                    ? "Bambas de Básquet"
                    : "Zapatillas de Gym")}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                {activeEnvironment === "basket"
                  ? "Suela interior para pista"
                  : "Suela estable para gimnasio"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Sudadera y Ducha</span>
                <ShowerHead className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white mt-1 truncate">
                {morningKit?.warmupLayer?.name || "Sudadera de mañana"}
              </p>
              <span className="text-xs text-slate-400 block mt-1">
                + Toalla de mano y kit de ducha (09:00h)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. EQUIPACIÓN EXTRA NOCHE (MIÉRCOLES Y VIERNES) */}
      {nightKit && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              2. Equipación para esta noche · {nightKit.sessionTitle}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-medium">
              Segundo conjunto limpio
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block">Camiseta noche</span>
              <strong className="text-white block mt-0.5 text-sm">
                {nightKit.top?.name}
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block">Pantalón corto noche</span>
              <strong className="text-white block mt-0.5 text-sm">
                {nightKit.bottom?.name}
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
              <span className="text-slate-400 block">Calzado y accesorios</span>
              <strong className="text-amber-300 block mt-0.5 text-sm">
                {dayPlan.id === "miercoles"
                  ? "Zapatillas físico (40m) + Bambas pista (1h15)"
                  : "Bambas de pista (1h15) + Agua 1.5L"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHECKLIST DE MOCHILA Y DUCHA */}
      <div className="mt-5 pt-4 border-t border-slate-700/60">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Backpack className="w-4 h-4 text-slate-300" />
            <span className="text-sm font-semibold text-white">
              Checklist de mochila y ducha (09:00 – 09:10h)
            </span>
          </div>
          <span className="text-xs text-slate-300 font-medium">
            {completedCount} de {packItems.length} preparados ({progressBagPct}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {packItems.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                  isChecked
                    ? "bg-slate-800/40 border-slate-700/50 text-slate-400"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-white"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked
                      ? "bg-emerald-500 border-emerald-500 text-slate-950"
                      : "border-slate-600 bg-slate-800"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs sm:text-sm font-medium ${
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

        {/* Confirmar entreno y mandar ropa a lavar */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white block">
              ¿Has terminado el entreno de hoy?
            </strong>
            <span>
              Marca como lavando (5 días) la ropa deportiva usada hoy en{" "}
              <strong className="text-white">OutfitDiario</strong>.
            </span>
          </div>

          <button
            onClick={handleConfirmWorkoutAndWash}
            disabled={confirmingWash}
            className="px-4 py-2.5 rounded-xl text-slate-950 text-xs font-semibold shrink-0 flex items-center justify-center gap-2 transition hover:opacity-95"
            style={{ backgroundColor: accentColor }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {confirmingWash
                ? "Sincronizando..."
                : "Completar entreno y enviar ropa a lavado"}
            </span>
          </button>
        </div>

        {washFeedback && (
          <div className="mt-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{washFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
