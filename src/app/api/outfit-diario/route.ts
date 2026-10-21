import { NextRequest, NextResponse } from "next/server";
import {
  WEEKLY_EUROFITNESS_PLAN,
  DayId,
  EnvironmentMode,
  getTodayDayId,
} from "@/lib/eurofitness-plan";

export const dynamic = "force-dynamic";

export interface OutfitDiarioGarment {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  warmth: string;
  occasions?: string | null;
  imageUrl?: string;
  isInWash?: boolean;
  remainingText?: string;
  usesSinceWash?: number;
  maxUsesBeforeWash?: number | null;
}

// Catálogo deportivo de respaldo sincronizado con la estructura exacta de OutfitDiario
const FALLBACK_SPORT_WARDROBE: OutfitDiarioGarment[] = [
  {
    id: "od-sport-top-1",
    name: "Camiseta Técnica Negra Pro-Dry",
    category: "ropa_deportiva",
    color: "Negro / Cian",
    style: "Deportivo, Compression Fit",
    warmth: "ligera",
    occasions: "Básquet, Running, Gym",
    isInWash: false,
  },
  {
    id: "od-sport-top-2",
    name: "Camiseta Reversible Básquet Club",
    category: "ropa_basquet",
    color: "Blanco / Azul Marino",
    style: "Deportivo, Oversize Court",
    warmth: "ligera",
    occasions: "Básquet",
    isInWash: false,
  },
  {
    id: "od-sport-top-3",
    name: "Camiseta Entreno Gris Perforada",
    category: "ropa_deportiva",
    color: "Gris Antracita",
    style: "Deportivo, Regular Fit",
    warmth: "ligera",
    occasions: "Básquet, Running",
    isInWash: false,
  },
  {
    id: "od-sport-top-4",
    name: "Camiseta Tirantes Shootaround Naranja/Negra",
    category: "ropa_basquet",
    color: "Negro / Naranja",
    style: "Deportivo, Court Fit",
    warmth: "ligera",
    occasions: "Básquet",
    isInWash: false,
  },
  {
    id: "od-sport-short-1",
    name: "Pantalón Corto Básquet Mesh + Malla",
    category: "pantalon_corto",
    color: "Negro",
    style: "Deportivo, Above Knee",
    warmth: "ligera",
    occasions: "Básquet, Running",
    isInWash: false,
  },
  {
    id: "od-sport-short-2",
    name: "Short Training Elástico 5''",
    category: "pantalon_corto",
    color: "Azul Marino",
    style: "Deportivo, Squat-Proof",
    warmth: "ligera",
    occasions: "Running, Básquet",
    isInWash: false,
  },
  {
    id: "od-sport-shoe-1",
    name: "Bambas Básquet Indoor High-Traction",
    category: "zapatos",
    color: "Blanco / Naranja Neón",
    style: "Deportivo, Suela Parqué",
    warmth: "media",
    occasions: "Básquet",
    isInWash: false,
  },
  {
    id: "od-sport-shoe-2",
    name: "Zapatillas Training & Gym Suela Plana",
    category: "zapatos",
    color: "Negro Mate / Verde",
    style: "Deportivo, Estabilidad Fuerza",
    warmth: "ligera",
    occasions: "Running, Casual",
    isInWash: false,
  },
  {
    id: "od-sport-hoodie-1",
    name: "Sudadera Calentamiento Zip-Hoodie",
    category: "sudadera",
    color: "Gris Vigoré",
    style: "Deportivo, Pre-Entreno 08:00h",
    warmth: "abrigada",
    occasions: "Universidad, Básquet, Casual",
    isInWash: false,
  },
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function pickSportOutfitForEnvironment(
  cleanClothes: OutfitDiarioGarment[],
  env: EnvironmentMode,
  dayId: DayId,
  variantIndex: number = 0
) {
  const sportTops = cleanClothes.filter((c) => {
    const cat = (c.category || "").toLowerCase();
    const name = (c.name || "").toLowerCase();
    const style = (c.style || "").toLowerCase();
    const occ = (c.occasions || "").toLowerCase();
    if (env === "basket") {
      return (
        cat === "ropa_basquet" ||
        cat === "ropa_deportiva" ||
        occ.includes("básquet") ||
        occ.includes("basquet") ||
        name.includes("basquet") ||
        name.includes("básquet") ||
        style.includes("deportivo")
      );
    }
    return (
      cat === "ropa_deportiva" ||
      cat === "ropa_basquet" ||
      cat === "camiseta_futbol" ||
      style.includes("deportivo") ||
      occ.includes("running") ||
      occ.includes("básquet")
    );
  });

  const fallbackTops =
    sportTops.length > 0
      ? sportTops
      : cleanClothes.filter((c) =>
          ["camiseta", "ropa_deportiva", "ropa_basquet"].includes(
            (c.category || "").toLowerCase()
          )
        );

  const sportShorts = cleanClothes.filter((c) => {
    const cat = (c.category || "").toLowerCase();
    const name = (c.name || "").toLowerCase();
    const style = (c.style || "").toLowerCase();
    return (
      cat === "pantalon_corto" ||
      cat === "ropa_basquet" ||
      name.includes("short") ||
      name.includes("corto") ||
      name.includes("jogger") ||
      style.includes("deportivo")
    );
  });

  const fallbackBottoms =
    sportShorts.length > 0
      ? sportShorts
      : cleanClothes.filter((c) =>
          ["pantalon_corto", "pantalon", "pantalones"].includes(
            (c.category || "").toLowerCase()
          )
        );

  const sportShoes = cleanClothes.filter((c) => {
    const cat = (c.category || "").toLowerCase();
    const name = (c.name || "").toLowerCase();
    const style = (c.style || "").toLowerCase();
    return (
      cat === "zapatos" &&
      (style.includes("deportivo") ||
        name.includes("zapatilla") ||
        name.includes("bamba") ||
        name.includes("running") ||
        name.includes("basquet"))
    );
  });

  const fallbackShoes =
    sportShoes.length > 0
      ? sportShoes
      : cleanClothes.filter((c) => (c.category || "").toLowerCase() === "zapatos");

  const warmups = cleanClothes.filter((c) =>
    ["sudadera", "chaqueta", "anorak"].includes((c.category || "").toLowerCase())
  );

  const morningTop =
    fallbackTops.length > 0
      ? fallbackTops[variantIndex % fallbackTops.length]
      : FALLBACK_SPORT_WARDROBE[0];
  const morningBottom =
    fallbackBottoms.length > 0
      ? fallbackBottoms[variantIndex % fallbackBottoms.length]
      : FALLBACK_SPORT_WARDROBE[4];
  const morningShoes =
    fallbackShoes.length > 0
      ? fallbackShoes[variantIndex % fallbackShoes.length]
      : FALLBACK_SPORT_WARDROBE[6];
  const morningWarmup =
    warmups.length > 0
      ? warmups[variantIndex % warmups.length]
      : FALLBACK_SPORT_WARDROBE[8];

  // Si es Miércoles (40m físico + 1h15 básquet) o Viernes (1h15 básquet), seleccionamos un segundo conjunto limpio para la noche
  const hasNightBasket = dayId === "miercoles" || dayId === "viernes";
  let nightBasketKit = null;

  if (hasNightBasket) {
    const nightTop =
      fallbackTops.length > 1
        ? fallbackTops[(variantIndex + 1) % fallbackTops.length]
        : FALLBACK_SPORT_WARDROBE[1];
    const nightBottom =
      fallbackBottoms.length > 1
        ? fallbackBottoms[(variantIndex + 1) % fallbackBottoms.length]
        : FALLBACK_SPORT_WARDROBE[4];
    const nightShoes =
      fallbackShoes.find((s) =>
        s.name.toLowerCase().includes("bamb") || s.name.toLowerCase().includes("basquet")
      ) || morningShoes;

    nightBasketKit = {
      sessionTitle:
        dayId === "miercoles"
          ? "Miércoles Noche: 40 min Físico + 1h 15min Básquet"
          : "Viernes Noche: 1h 15min Entreno Básquet",
      top: nightTop,
      bottom: nightBottom,
      shoes: nightShoes,
      extraGear:
        dayId === "miercoles"
          ? [
              "Zapatillas running/físico (primeros 40 min) + Bambas de pista (1h 15m)",
              "Camiseta reversible clara/oscura",
              "Bidón isotónico 1.5L + Toalla de banquillo",
            ]
          : [
              "Bambas de básquet suela limpia",
              "Camiseta reversible de entreno",
              "Calcetines técnicos media caña + Agua 1.5L",
            ],
    };
  }

  return {
    morningSportKit: {
      environment: env,
      top: env === "pool" ? null : morningTop,
      bottom: env === "pool" ? null : morningBottom,
      shoes: env === "pool" ? null : morningShoes,
      warmupLayer: morningWarmup,
      poolKit:
        env === "pool"
          ? {
              swimsuit: "Bañador Deportivo Hidrodinámico",
              capAndGoggles: "Gorro de Silicona + Gafas Antivaho",
              flipFlops: "Chanclas de Piscina Antideslizantes",
              towel: "Toalla Microfibra XL + Bolsa Estanca",
            }
          : null,
    },
    showerAndUniTransition: {
      window: "09:00 – 09:10h (Vestuarios Eurofitness Estació del Nord)",
      items: [
        "Toalla de ducha limpia + Chanclas",
        env === "pool"
          ? "Gel y champú anti-cloro + crema hidratante rápida"
          : "Gel energizante + desodorante roll-on",
        "Muda interior limpia + calcetines para el Outfit de Universidad",
        "Bolsa impermeable para aislar la ropa usada de los apuntes de la Uni",
      ],
    },
    nightBasketKit,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dayParam = (searchParams.get("day") as DayId) || getTodayDayId();
  const dayPlan = WEEKLY_EUROFITNESS_PLAN[dayParam] || WEEKLY_EUROFITNESS_PLAN.lunes;
  const envOverride = (searchParams.get("environment") as EnvironmentMode) || dayPlan.environment;
  const variant = Number(searchParams.get("variant") || "0");

  const customBaseUrl =
    searchParams.get("outfitDiarioUrl") ||
    process.env.OUTFIT_DIARIO_URL ||
    "http://localhost:3000";

  let connectedLive = false;
  let wardrobeItems: OutfitDiarioGarment[] = [];
  let lastUniOutfit: any = null;
  let sourceEndpoint = customBaseUrl;

  // Intentar conectar en tiempo real con OutfitDiario (Local o Vercel)
  const urlsToTry = Array.from(
    new Set([
      customBaseUrl.replace(/\/$/, ""),
      "http://localhost:3000",
      "https://outfit-diario.vercel.app",
    ])
  );

  for (const baseUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2200);

      const res = await fetch(`${baseUrl}/api/clothes?inWash=false`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          wardrobeItems = json.data;
          connectedLive = true;
          sourceEndpoint = baseUrl;

          // También consultar el último Outfit de Universidad elegido hoy
          try {
            const lastRes = await fetch(`${baseUrl}/api/outfits?last=true`, {
              cache: "no-store",
            });
            if (lastRes.ok) {
              const lastJson = await lastRes.json();
              if (lastJson.success && lastJson.data) {
                lastUniOutfit = lastJson.data;
              }
            }
          } catch {
            // ignore optional last outfit fetch error
          }
          break;
        }
      }
    } catch {
      // Try next endpoint or fallback
    }
  }

  const effectiveClothes =
    wardrobeItems.length > 0 ? wardrobeItems : FALLBACK_SPORT_WARDROBE;

  const generated = pickSportOutfitForEnvironment(
    effectiveClothes,
    envOverride,
    dayPlan.id,
    variant
  );

  return NextResponse.json(
    {
      success: true,
      connectedLive,
      sourceEndpoint,
      day: dayPlan.id,
      dayName: dayPlan.dayName,
      eurofitnessSession: {
        headline: dayPlan.headline,
        facilityZone: dayPlan.facilityZone,
        environment: envOverride,
        morningSchedule: "08:00 - 09:00 Entreno · 09:00 - 09:10 Ducha · 09:30 Uni",
        nightBasket: dayPlan.nightBasket,
      },
      extraOutfitConfig: generated,
      lastUniOutfit,
      extraPackChecklist: dayPlan.extraOutfitPack,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      outfitDiarioUrl = "http://localhost:3000",
      garmentIds = [],
      dayId = "lunes",
      environment = "gym",
    } = body;

    const cleanUrl = outfitDiarioUrl.replace(/\/$/, "");
    const washedItems: string[] = [];
    let syncedWithServer = false;

    for (const id of garmentIds) {
      if (!id || String(id).startsWith("od-sport-")) continue;
      try {
        const res = await fetch(`${cleanUrl}/api/clothes/${id}/wash`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "wash" }),
        });
        if (res.ok) {
          washedItems.push(id);
          syncedWithServer = true;
        }
      } catch {
        // Offline fallback handled on client
      }
    }

    return NextResponse.json(
      {
        success: true,
        syncedWithServer,
        washedCount: washedItems.length,
        message: syncedWithServer
          ? `¡Sincronizado con OutfitDiario! Las prendas deportivas usadas de 08:00 a 09:00 han pasado a lavado (5 días) en tu armario.`
          : `¡Entreno de ${dayId.toUpperCase()} (${environment.toUpperCase()}) registrado! Tu Pack Deportivo + Ducha (09:00-09:10) ha quedado marcado como completado.`,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al sincronizar el outfit deportivo con OutfitDiario.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
