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
  Sparkles,
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

  // Load saved URL and checklist from localStorage
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
    const nextV = variant + 1;
    setVariant(nextV);
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
        "Entreno completado y registrado localmente. Listo para la ducha de 09:00 a 09:10h."
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
    <div
      className="cyber-glass rounded-2xl border p-5 relative overflow-hidden"
      style={{ borderColor: `${accentColor}50` }}
    >
      {/* Header: Conexión con OutfitDiario */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800/90">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
            style={{
              borderColor: `${accentColor}60`,
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                {isConnectedLive
                  ? "OUTFITDIARIO · ARMARIOS EN VIVO"
                  : "OUTFITDIARIO · MOTOR SINCRONIZADO"}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                + OUTFIT EXTRA DEPORTIVO (08:00-09:10)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {dayPlan.extraOutfitPack.packName}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {dayPlan.extraOutfitPack.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrlConfig(!showUrlConfig)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs transition"
            title="Configurar URL de OutfitDiario (Local o Vercel)"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotateSportKit}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-cyber-cyan ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span>Rotar Outfit Extra</span>
          </button>
          <a
            href={outfitDiarioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl font-mono text-xs font-bold text-slate-950 flex items-center gap-1.5 transition hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            <span>Abrir OutfitDiario</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Optional URL Configurator */}
      {showUrlConfig && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-xs font-mono text-slate-400 shrink-0">
            URL de tu app OutfitDiario:
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
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
          />
          <button
            onClick={() => fetchOutfitDiarioSync(variant, outfitDiarioUrl)}
            className="px-3 py-1.5 rounded-lg bg-cyber-cyan text-slate-950 font-mono text-xs font-bold"
          >
            Probar Conexión
          </button>
        </div>
      )}

      {/* 1. OUTFIT EXTRA MATUTINO (08:00 - 09:00 EN EUROFITNESS) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-cyber-cyan flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            1. Outfit Extra Entreno Matutino (08:00 – 09:00h)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Instalación:{" "}
            <strong className="text-white uppercase">
              {activeEnvironment === "pool"
                ? "Piscina 25m"
                : activeEnvironment === "basket"
                ? "Pista Básquet + Sala"
                : "Sala Fitness Gym"}
            </strong>
          </span>
        </div>

        {activeEnvironment === "pool" && morningKit?.poolKit ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                <span>BAÑADOR</span>
                <Waves className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {morningKit.poolKit.swimsuit}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Llevar puesto desde casa a las 07:45h debajo del chándal/pantalón para ganar 3 min
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                <span>GORRO & GAFAS</span>
                <Waves className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {morningKit.poolKit.capAndGoggles}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Obligatorios en vaso de 25m Eurofitness Estació del Nord
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                <span>CALZADO AGUA</span>
                <ShowerHead className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {morningKit.poolKit.flipFlops}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Uso en playa de piscina y ducha express 09:00–09:10h
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
                <span>ABRIGO 07:45H / SECADO</span>
                <Shirt className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {morningKit.warmupLayer?.name || "Sudadera Calentamiento"}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                + {morningKit.poolKit.towel}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyber-emerald uppercase">
                <span>TOP ENTRENO (08:00H)</span>
                <Shirt className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {morningKit?.top?.name || "Camiseta Técnica Entreno"}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Color: {morningKit?.top?.color || "Negro"} · Limpia en Armario
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyber-emerald uppercase">
                <span>SHORT / INFERIOR</span>
                <Dumbbell className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {morningKit?.bottom?.name || "Pantalón Corto Deportivo"}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Color: {morningKit?.bottom?.color || "Negro"} · Alta movilidad
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyber-orange uppercase">
                <span>CALZADO ESPECÍFICO</span>
                <Dribbble className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {morningKit?.shoes?.name ||
                  (activeEnvironment === "basket"
                    ? "Bambas Básquet Indoor"
                    : "Zapatillas Training Gym")}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {activeEnvironment === "basket"
                  ? "Suela limpia parqué Eurofitness"
                  : "Base estable para fuerza y saltos"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 uppercase">
                <span>CAPA 07:45H & DUCHA</span>
                <ShowerHead className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {morningKit?.warmupLayer?.name || "Sudadera Pre-Entreno"}
              </p>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                + Toalla de mano + Kit Ducha 09:00h
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. SI ES MIÉRCOLES O VIERNES: SEGUNDO OUTFIT DEPORTIVO PARA EL BÁSQUET DE LA NOCHE */}
      {nightKit && (
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-orange-950/60 via-slate-950/90 to-slate-950/90 border border-cyber-orange/50">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase text-cyber-orange flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              2. Outfit Extra Nocturno · {nightKit.sessionTitle}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyber-orange/20 text-cyber-orange font-mono text-[10px] font-bold">
              SEGUNDO SET LIMPIO RESERVADO
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                CAMISETA NOCHE
              </span>
              <strong className="text-white block mt-0.5">
                {nightKit.top?.name}
              </strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                SHORT CANCHA NOCHE
              </span>
              <strong className="text-white block mt-0.5">
                {nightKit.bottom?.name}
              </strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">
                EQUIPO ESPECÍFICO NOCHE
              </span>
              <strong className="text-cyber-orange block mt-0.5">
                {dayPlan.id === "miercoles"
                  ? "Bambas Físico (40m) + Bambas Pista (1h15)"
                  : "Bambas Pista (1h15) + Agua 1.5L"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHECKLIST INTERACTIVA DE MOCHILA + BOTÓN DE LAVADO EN OUTFITDIARIO */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Backpack className="w-4 h-4 text-cyber-emerald" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-white">
              Checklist Mochila Eurofitness + Muda Post-Ducha (09:00–09:10h)
            </span>
          </div>
          <span className="font-mono text-xs text-cyber-emerald font-bold">
            {completedCount}/{packItems.length} listos ({progressBagPct}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {packItems.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  isChecked
                    ? "bg-emerald-950/25 border-emerald-500/40 text-slate-300"
                    : "bg-slate-950/75 border-slate-800/90 hover:border-slate-700 text-white"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked
                      ? "bg-cyber-emerald border-cyber-emerald text-slate-950"
                      : "border-slate-600 bg-slate-900"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs font-semibold leading-snug ${
                      isChecked ? "line-through text-slate-400" : "text-white"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.reason}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bar: Confirm Workout & Send Sport Clothes to Wash in OutfitDiario */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-3">
          <div className="text-xs text-slate-300">
            <strong className="text-white block">
              ¿Terminaste el entreno de 08:00 a 09:00h?
            </strong>
            <span>
              Registra la sesión y envía automáticamente la ropa deportiva usada hoy a{" "}
              <span className="text-cyber-cyan font-semibold">
                Lavado (5 días) en OutfitDiario
              </span>{" "}
              para que mañana te asigne otra limpia.
            </span>
          </div>

          <button
            onClick={handleConfirmWorkoutAndWash}
            disabled={confirmingWash}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-slate-950 font-mono text-xs font-bold uppercase tracking-wider shrink-0 flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {confirmingWash
                ? "Sincronizando..."
                : "Completar 09:00h & Enviar Ropa a Lavado"}
            </span>
          </button>
        </div>

        {washFeedback && (
          <div className="mt-2.5 p-3 rounded-xl bg-emerald-950/50 border border-cyber-emerald/50 text-xs text-emerald-200 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
            <span>{washFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
