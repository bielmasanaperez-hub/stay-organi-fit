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
  accentColor?: string;
}

export default function OutfitDiarioBridge({
  dayPlan,
  activeEnvironment,
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
        "Sesión registrada. Tu equipación deportiva ha quedado marcada como completada."
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
    <section className="luxury-panel rounded-2xl p-6 sm:p-8 shadow-2xl">
      {/* Header: Private Locker Room & OutfitDiario Concierge */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-club-gold/15">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-club-obsidian border border-club-gold/35 flex items-center justify-center text-club-gold shrink-0">
            <Shirt className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-club-gold font-semibold flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                {isConnectedLive
                  ? "VESTUARIO & CONCIERGE · OUTFITDIARIO EN VIVO"
                  : "VESTUARIO & CONCIERGE · SINCRONIZADO CON OUTFITDIARIO"}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-club-ivory mt-1">
              {dayPlan.extraOutfitPack.packName}
            </h2>
            <p className="text-xs sm:text-sm text-club-stone mt-1 max-w-2xl leading-relaxed">
              {dayPlan.extraOutfitPack.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowUrlConfig(!showUrlConfig)}
            className="p-2.5 rounded-xl bg-club-obsidian hover:bg-club-elevated border border-white/10 text-club-stone hover:text-club-ivory transition"
            title="Configurar conexión con OutfitDiario"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotateSportKit}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-club-obsidian hover:bg-club-elevated border border-club-gold/25 text-xs uppercase tracking-[0.14em] font-medium text-club-ivory flex items-center gap-2 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-club-gold ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span>Rotar Equipación</span>
          </button>
          <a
            href={outfitDiarioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-club-gold hover:bg-club-goldLight text-club-obsidian text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 transition shadow-md"
          >
            <span>Abrir OutfitDiario</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {showUrlConfig && (
        <div className="mt-4 p-4 rounded-xl bg-club-obsidian border border-club-gold/25 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-club-stone shrink-0">
            Enlace OutfitDiario:
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
            className="flex-1 bg-club-surface border border-white/10 rounded-lg px-3.5 py-2 text-xs text-club-ivory focus:outline-none focus:border-club-gold"
          />
          <button
            onClick={() => fetchOutfitDiarioSync(variant, outfitDiarioUrl)}
            className="px-4 py-2 rounded-lg bg-club-gold text-club-obsidian text-xs uppercase tracking-widest font-semibold"
          >
            Conectar
          </button>
        </div>
      )}

      {/* I. OUTFIT DEPORTIVO MATUTINO (08:00 - 09:00) */}
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-club-gold font-semibold block">
              SECCIÓN I · EQUIPACIÓN DEPORTIVA MATUTINA (08:00 – 09:00H)
            </span>
            <h3 className="font-serif text-xl font-semibold text-club-ivory mt-0.5">
              Selección de Prendas Limpias para Eurofitness Estació del Nord
            </h3>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-club-stone">
            Espacio:{" "}
            <strong className="text-club-ivory">
              {activeEnvironment === "pool"
                ? "Piscina Climatizada 25m"
                : activeEnvironment === "basket"
                ? "Pista Parquet & Sala"
                : "Sala Fitness & Fuerza"}
            </strong>
          </span>
        </div>

        {activeEnvironment === "pool" && morningKit?.poolKit ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span> I · Bañador</span>
                <Waves className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5">
                {morningKit.poolKit.swimsuit}
              </p>
              <span className="text-xs text-club-stone block mt-1 leading-relaxed">
                Llevar puesto desde casa (07:45h) para entrar al agua a las 08:00h en punto.
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>II · Gorro & Gafas</span>
                <Waves className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5">
                {morningKit.poolKit.capAndGoggles}
              </p>
              <span className="text-xs text-club-stone block mt-1 leading-relaxed">
                Equipamiento reglamentario para los carriles de 25m del club.
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>III · Calzado Agua</span>
                <ShowerHead className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5">
                {morningKit.poolKit.flipFlops}
              </p>
              <span className="text-xs text-club-stone block mt-1 leading-relaxed">
                Imprescindibles en zona de aguas y vestuario (09:00–09:10h).
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>IV · Exterior & Toalla</span>
                <Shirt className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5">
                {morningKit.warmupLayer?.name || "Sudadera Club"}
              </p>
              <span className="text-xs text-club-stone block mt-1 leading-relaxed">
                + {morningKit.poolKit.towel}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>I · Prenda Superior</span>
                <Shirt className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5 truncate">
                {morningKit?.top?.name || "Camiseta Técnica Club"}
              </p>
              <span className="text-xs text-club-stone block mt-1">
                Tono: {morningKit?.top?.color || "Negro"} · Disponible en Armario
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>II · Prenda Inferior</span>
                <Dumbbell className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5 truncate">
                {morningKit?.bottom?.name || "Pantalón Corto Training"}
              </p>
              <span className="text-xs text-club-stone block mt-1">
                Tono: {morningKit?.bottom?.color || "Negro"} · Corte Atlético
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>III · Calzado Técnico</span>
                <Dribbble className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5 truncate">
                {morningKit?.shoes?.name ||
                  (activeEnvironment === "basket"
                    ? "Zapatillas Cancha Indoor"
                    : "Zapatillas Suela Plana")}
              </p>
              <span className="text-xs text-club-stone block mt-1">
                {activeEnvironment === "basket"
                  ? "Tracción para parqué interior"
                  : "Estabilidad en peso libre y salto"}
              </span>
            </div>

            <div className="luxury-subcard rounded-xl p-4 border-l-2 border-l-club-gold">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-club-gold font-semibold">
                <span>IV · Abrigo 07:45h & Ducha</span>
                <ShowerHead className="w-3.5 h-3.5" />
              </div>
              <p className="font-serif text-lg font-semibold text-club-ivory mt-1.5 truncate">
                {morningKit?.warmupLayer?.name || "Sudadera Calentamiento"}
              </p>
              <span className="text-xs text-club-stone block mt-1">
                + Toalla de sala y neceser de vestuario
              </span>
            </div>
          </div>
        )}
      </div>

      {/* II. SEGUNDA EQUIPACIÓN NOCTURNA (MIÉRCOLES Y VIERNES) */}
      {nightKit && (
        <div className="mt-6 p-5 rounded-xl bg-club-obsidian/90 border border-club-gold/30">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-club-gold font-semibold flex items-center gap-2">
              <Moon className="w-4 h-4" />
              SECCIÓN II · EQUIPACIÓN RESERVADA PARA ESTA NOCHE ({nightKit.sessionTitle})
            </span>
            <span className="px-3 py-1 rounded-full bg-club-gold/15 text-club-goldLight text-[10px] uppercase tracking-widest font-semibold">
              Segundo Conjunto Limpio
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-club-surface border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-club-stone block">
                Prenda Superior Noche
              </span>
              <strong className="font-serif text-base text-club-ivory block mt-1">
                {nightKit.top?.name}
              </strong>
            </div>
            <div className="p-3.5 rounded-lg bg-club-surface border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-club-stone block">
                Prenda Inferior Noche
              </span>
              <strong className="font-serif text-base text-club-ivory block mt-1">
                {nightKit.bottom?.name}
              </strong>
            </div>
            <div className="p-3.5 rounded-lg bg-club-surface border border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-club-stone block">
                Calzado & Especificaciones
              </span>
              <strong className="font-serif text-base text-club-goldLight block mt-1">
                {dayPlan.id === "miercoles"
                  ? "Calzado Físico (40m) + Bambas Pista (1h15)"
                  : "Bambas de Pista (1h15) + Hidratación 1.5L"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* III. CHECKLIST DE VESTUARIO (09:00 - 09:10H) Y ENVÍO A COLADA */}
      <div className="mt-6 pt-6 border-t border-club-gold/15">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <Backpack className="w-4 h-4 text-club-gold" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-club-ivory">
              Verificación de Bolsa de Club & Ducha Express (09:00 – 09:10h)
            </span>
          </div>
          <span className="font-mono text-xs text-club-gold">
            {completedCount} / {packItems.length} LISTOS ({progressBagPct}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {packItems.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3.5 transition ${
                  isChecked
                    ? "bg-club-obsidian/50 border-club-gold/20 text-club-muted"
                    : "luxury-subcard hover:border-club-gold/30 text-club-ivory"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition ${
                    isChecked
                      ? "bg-club-gold border-club-gold text-club-obsidian"
                      : "border-club-stone/40 bg-club-obsidian"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      isChecked
                        ? "line-through text-club-muted"
                        : "text-club-ivory"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs text-club-stone mt-0.5">
                    {item.reason}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirmar sesión y enviar a lavado en OutfitDiario */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-club-obsidian border border-club-gold/25 rounded-xl p-4 sm:p-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-club-gold font-semibold block">
              CIERRE DE SESIÓN MATUTINA (09:00H)
            </span>
            <p className="text-xs sm:text-sm text-club-stone mt-1">
              Al finalizar tu entrenamiento, registra la sesión para enviar automáticamente las prendas deportivas usadas al ciclo de colada (5 días) en{" "}
              <strong className="text-club-ivory">OutfitDiario</strong>.
            </p>
          </div>

          <button
            onClick={handleConfirmWorkoutAndWash}
            disabled={confirmingWash}
            className="px-6 py-3 rounded-xl bg-club-gold hover:bg-club-goldLight text-club-obsidian text-xs uppercase tracking-[0.16em] font-semibold shrink-0 flex items-center justify-center gap-2 transition shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {confirmingWash
                ? "Sincronizando..."
                : "Finalizar Sesión & Enviar a Colada"}
            </span>
          </button>
        </div>

        {washFeedback && (
          <div className="mt-3 p-3.5 rounded-xl bg-club-elevated border border-club-gold/40 text-xs text-club-goldLight flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-club-gold shrink-0" />
            <span>{washFeedback}</span>
          </div>
        )}
      </div>
    </section>
  );
}
