export type EnvironmentMode = "gym" | "pool" | "basket";

export type DayId = "lunes" | "martes" | "miercoles" | "jueves" | "viernes";

export interface ExerciseStep {
  id: string;
  name: string;
  setsAndReps: string;
  restSeconds: number;
  durationMinutes: number;
  zone: string; // e.g., "Rack de Fuerza", "Piscina 25m · Carril Medio", "Pista Polideportiva"
  tip: string;
}

export interface TempoBlock {
  id: string;
  tempoNumber: string; // "TEMPO 01", "TEMPO 02", "TEMPO 03", "TEMPO DUCHA", "TEMPO UNI"
  title: string;
  startTime: string; // "08:00"
  endTime: string;   // "08:08"
  durationMinutes: number;
  phaseType: "warmup" | "main" | "cooldown" | "shower" | "commute";
  accentColor: string;
  description: string;
  exercises: ExerciseStep[];
}

export interface GearItem {
  id: string;
  name: string;
  category: "prenda_armario" | "equipo_piscina" | "equipo_gym" | "equipo_basquet" | "ducha_higiene" | "muda_uni";
  slotHint?: "camiseta" | "pantalon_corto" | "zapatos" | "sudadera" | "accesorio";
  essential: boolean;
  reason: string;
}

export interface NightBasketSession {
  active: boolean;
  title: string;
  physioDurationMin: number;
  courtDurationMin: number;
  totalDurationLabel: string;
  loadLevel: "MUY ALTA" | "ALTA" | "DESCANSO";
  coachNote: string;
}

export interface DayPlan {
  id: DayId;
  dayNumber: number; // 1 = Lunes ... 5 = Viernes
  dayName: string;
  shortName: string;
  environment: EnvironmentMode;
  facilityZone: string;
  headline: string;
  subtitle: string;
  intensityPct: number;
  caloriesEst: number;
  cnsLoad: "BAJA (Descarga)" | "MEDIA (Técnica/PAP)" | "ALTA (Potencia)";
  bgImage: string;
  themeAccent: {
    primary: string;
    glow: string;
    badgeBg: string;
    border: string;
  };
  nightBasket: NightBasketSession;
  tempos: TempoBlock[];
  extraOutfitPack: {
    packName: string;
    outfitDiarioOccasion: string;
    summary: string;
    items: GearItem[];
  };
}

export const EUROFITNESS_INFO = {
  name: "CEM Eurofitness Estació del Nord",
  address: "C/ Nàpols, 42-44, 08018 Barcelona",
  morningWindow: "08:00 – 09:00 Entreno · 09:00 – 09:10 Ducha Express · 09:30 Entrada Uni",
  facilities: [
    {
      id: "gym" as EnvironmentMode,
      name: "Sala Fitness & Peso Libre",
      icon: "Dumbbell",
      zone: "Planta Fitness · Racks, Poleas y Zona Funcional",
      bgImage: "/bg-gym.png",
    },
    {
      id: "pool" as EnvironmentMode,
      name: "Piscina Climatizada 25m + Hidromasaje",
      icon: "Waves",
      zone: "Zona Acuática · Carriles de nado y contrastes",
      bgImage: "/bg-pool.png",
    },
    {
      id: "basket" as EnvironmentMode,
      name: "Pabellón Polideportivo / Pista Básquet",
      icon: "Dribbble",
      zone: "Pista Central Parquet · Canastas oficiales",
      bgImage: "/bg-basket.png",
    },
  ],
};

export const WEEKLY_EUROFITNESS_PLAN: Record<DayId, DayPlan> = {
  lunes: {
    id: "lunes",
    dayNumber: 1,
    dayName: "Lunes",
    shortName: "LUN",
    environment: "gym",
    facilityZone: "Sala Fitness · Zona Racks & Pliometría",
    headline: "Fuerza Explosiva, Salto Vertical & Core",
    subtitle: "Empezamos la semana frescos: potencia de tren inferior enfocada a básquet y estabilidad de rodilla/tobillo.",
    intensityPct: 85,
    caloriesEst: 460,
    cnsLoad: "ALTA (Potencia)",
    bgImage: "/bg-gym.png",
    themeAccent: {
      primary: "#00FF87",
      glow: "rgba(0, 255, 135, 0.32)",
      badgeBg: "rgba(0, 255, 135, 0.12)",
      border: "rgba(0, 255, 135, 0.4)",
    },
    nightBasket: {
      active: false,
      title: "Tarde Libre de Equipo",
      physioDurationMin: 0,
      courtDurationMin: 0,
      totalDurationLabel: "Descanso nocturno",
      loadLevel: "DESCANSO",
      coachNote: "Sin entreno de equipo hoy por la noche: aprovechamos las 08:00h para meter la sesión principal de fuerza explosiva de piernas en el Gym.",
    },
    tempos: [
      {
        id: "lun-t1",
        tempoNumber: "TEMPO 01",
        title: "Activación Dinámica & Tobillo/Cadera",
        startTime: "08:00",
        endTime: "08:08",
        durationMinutes: 8,
        phaseType: "warmup",
        accentColor: "#00F0FF",
        description: "Subir pulsaciones rápido y lubricar articulaciones antes de tocar hierro.",
        exercises: [
          {
            id: "lun-e1",
            name: "Movilidad dorsiflexión tobillo + 90/90 cadera + banda glúteo",
            setsAndReps: "2 vueltas continuas (4 min)",
            restSeconds: 0,
            durationMinutes: 4,
            zone: "Zona Funcional / Esterillas",
            tip: "Esencial para proteger tobillos en recepciones de rebote.",
          },
          {
            id: "lun-e2",
            name: "Saltos a la comba + Pogos reactivos + Saltos al cajón suaves",
            setsAndReps: "3 x 30 seg activa / 15 seg pausa",
            restSeconds: 15,
            durationMinutes: 4,
            zone: "Zona Pliometría",
            tip: "Contacto mínimo con el suelo, buscando reactividad en el tendón de Aquiles.",
          },
        ],
      },
      {
        id: "lun-t2",
        tempoNumber: "TEMPO 02",
        title: "Bloque Principal · Fuerza Explosiva (Contrast Training)",
        startTime: "08:08",
        endTime: "08:53",
        durationMinutes: 45,
        phaseType: "main",
        accentColor: "#00FF87",
        description: "Superseries cronometradas de fuerza + transferencia a salto para acabar a las 08:53 en punto.",
        exercises: [
          {
            id: "lun-e3",
            name: "A1. Sentadilla Trap Bar / Sentadilla Trasera + A2. Box Jumps",
            setsAndReps: "4 series × (5 reps pesadas + 4 saltos explosivos)",
            restSeconds: 90,
            durationMinutes: 15,
            zone: "Rack Principal Eurofitness",
            tip: "Baja controlado 2 seg, sube a máxima velocidad intencional.",
          },
          {
            id: "lun-e4",
            name: "B1. Sentadilla Búlgara con Mancuernas + B2. Peso Muerto Rumano",
            setsAndReps: "3 series × 8 reps por pierna + 10 reps isquios",
            restSeconds: 60,
            durationMinutes: 16,
            zone: "Zona Peso Libre / Mancuernas",
            tip: "Foco en estabilidad unilateral para entradas a canasta y frenadas.",
          },
          {
            id: "lun-e5",
            name: "C1. Press Pallof Antirrotación Polea + C2. Rueda Abdominal / Plancha",
            setsAndReps: "3 series × 12 reps por lado + 40 seg isométrico",
            restSeconds: 45,
            durationMinutes: 14,
            zone: "Torre de Poleas",
            tip: "Core blindado para aguantar contactos en el aire sin perder equilibrio.",
          },
        ],
      },
      {
        id: "lun-t3",
        tempoNumber: "TEMPO 03",
        title: "Descompresión & Isométricos Tendón Rotuliano",
        startTime: "08:53",
        endTime: "09:00",
        durationMinutes: 7,
        phaseType: "cooldown",
        accentColor: "#00F0FF",
        description: "Bajar pulsaciones para no seguir sudando al salir de la ducha.",
        exercises: [
          {
            id: "lun-e6",
            name: "Spanish Squat isométrico con banda + Estiramiento flexores cadera",
            setsAndReps: "2 × 45 seg isométrico + 3 min respiración nasal",
            restSeconds: 30,
            durationMinutes: 7,
            zone: "Zona Estiramientos",
            tip: "Analgesia inmediata para rodillas de jugador de básquet.",
          },
        ],
      },
      {
        id: "lun-t4",
        tempoNumber: "TEMPO DUCHA",
        title: "Ducha Express & Transición a OutfitDiario Uni",
        startTime: "09:00",
        endTime: "09:10",
        durationMinutes: 10,
        phaseType: "shower",
        accentColor: "#A855F7",
        description: "10 minutos exactos: ducha templada-fría (cierra poros), vestir el outfit de Universidad generado en OutfitDiario y salir.",
        exercises: [
          {
            id: "lun-e7",
            name: "Ducha rápida (4 min) + Secado y vestirse Outfit Uni (6 min)",
            setsAndReps: "Salida vestuario límite: 09:10h",
            restSeconds: 0,
            durationMinutes: 10,
            zone: "Vestuarios Eurofitness Estació del Nord",
            tip: "Últimos 30 seg con agua fresca para cortar la sudoración antes de ponerte la ropa de la Uni.",
          },
        ],
      },
    ],
    extraOutfitPack: {
      packName: "Pack Gym Potencia + Kit Ducha Uni",
      outfitDiarioOccasion: "Universidad",
      summary: "Equipación transpirable de gimnasio (8:00-9:00) + Kit completo de vestuario para cambiarte al Outfit de Universidad a las 9:05h.",
      items: [
        { id: "g-top", name: "Camiseta técnica transpirable Gym", category: "prenda_armario", slotHint: "camiseta", essential: true, reason: "1 uso deportivo -> pasa a lavado en OutfitDiario al terminar" },
        { id: "g-short", name: "Pantalón corto training elástico", category: "prenda_armario", slotHint: "pantalon_corto", essential: true, reason: "Libertad de movimiento en sentadilla y saltos" },
        { id: "g-shoes", name: "Zapatillas de suela plana / Training", category: "prenda_armario", slotHint: "zapatos", essential: true, reason: "Estabilidad en Rack y pliometría" },
        { id: "g-towel-s", name: "Toalla pequeña de mano (obligatoria sala fitness)", category: "equipo_gym", essential: true, reason: "Normativa Eurofitness en máquinas y bancos" },
        { id: "g-towel-l", name: "Toalla grande de ducha microfibra", category: "ducha_higiene", essential: true, reason: "Para ducha de 09:00 a 09:10h" },
        { id: "g-flip", name: "Chanclas de vestuario", category: "ducha_higiene", essential: true, reason: "Higiene en duchas Eurofitness" },
        { id: "g-soap", name: "Neceser express (gel, desodorante, peine)", category: "ducha_higiene", essential: true, reason: "Transición limpia hacia la Uni (09:30h)" },
        { id: "g-under", name: "Muda interior limpia + calcetines de calle", category: "muda_uni", essential: true, reason: "Para vestir con el Outfit principal de Universidad" },
      ],
    },
  },

  martes: {
    id: "martes",
    dayNumber: 2,
    dayName: "Martes",
    shortName: "MAR",
    environment: "basket",
    facilityZone: "Pista Básquet Eurofitness (25m) + Sala Fitness Tren Superior (25m)",
    headline: "Híbrido: Tiro en Pista + Fuerza Tren Superior",
    subtitle: "Aprovechamos la pista del Eurofitness a primera hora para mecánica de tiro/bote y rematamos con torso en el gym.",
    intensityPct: 80,
    caloriesEst: 490,
    cnsLoad: "ALTA (Potencia)",
    bgImage: "/bg-basket.png",
    themeAccent: {
      primary: "#FF6B00",
      glow: "rgba(255, 107, 0, 0.35)",
      badgeBg: "rgba(255, 107, 0, 0.14)",
      border: "rgba(255, 107, 0, 0.45)",
    },
    nightBasket: {
      active: false,
      title: "Vigilia del Miércoles Doble",
      physioDurationMin: 0,
      courtDurationMin: 0,
      totalDurationLabel: "Descanso nocturno (mañana noche hay Físico + Básquet)",
      loadLevel: "DESCANSO",
      coachNote: "Hoy no tocamos piernas pesadas para que mañana miércoles llegues al 100% al físico de 40 min + 1h15 de básquet con el equipo.",
    },
    tempos: [
      {
        id: "mar-t1",
        tempoNumber: "TEMPO 01",
        title: "Ball-Handling & Activación de Muñeca/Hombro en Pista",
        startTime: "08:00",
        endTime: "08:08",
        durationMinutes: 8,
        phaseType: "warmup",
        accentColor: "#FF6B00",
        description: "Entramos directo a la pista de básquet del Eurofitness con balón en mano.",
        exercises: [
          {
            id: "mar-e1",
            name: "Bote estacionario doble ritmo + cambios entre piernas/espalda",
            setsAndReps: "4 min continuos variando alturas",
            restSeconds: 0,
            durationMinutes: 4,
            zone: "Pista de Básquet Eurofitness",
            tip: "Mirada arriba siempre, bote fuerte a la altura del bolsillo.",
          },
          {
            id: "mar-e2",
            name: "Form Shooting a 1 mano + entradas dinámicas por ambos perfiles",
            setsAndReps: "20 tiros cercanos perfectos + 8 finalizaciones",
            restSeconds: 0,
            durationMinutes: 4,
            zone: "Pista de Básquet Eurofitness",
            tip: "Mantén el follow-through (cuello de cisne) 1 segundo en cada tiro.",
          },
        ],
      },
      {
        id: "mar-t2",
        tempoNumber: "TEMPO 02",
        title: "Bloque A: Volumen de Tiro (20 min) + Bloque B: Torso Gym (25 min)",
        startTime: "08:08",
        endTime: "08:53",
        durationMinutes: 45,
        phaseType: "main",
        accentColor: "#FF6B00",
        description: "A las 08:28 subimos de la pista a la Sala Fitness para 25 min intensos de tren superior en superserie.",
        exercises: [
          {
            id: "mar-e3",
            name: "Pista: 5 Spots Catch & Shoot + Pull-ups tras 1 bote (Codo y 45°)",
            setsAndReps: "Objetivo: anotar 50 triples/media distancia en 20 min",
            restSeconds: 15,
            durationMinutes: 20,
            zone: "Pista de Básquet Eurofitness (08:08 - 08:28)",
            tip: "Recoge tu propio rebote al sprint suave para meter ritmo cardíaco.",
          },
          {
            id: "mar-e4",
            name: "Gym: A1. Press Inclinado Mancuernas + A2. Dominadas / Jalón al Pecho",
            setsAndReps: "4 series × 8-10 reps + 8-10 reps (Superserie sin pausa)",
            restSeconds: 60,
            durationMinutes: 14,
            zone: "Sala Fitness Eurofitness (08:28 - 08:42)",
            tip: "Empuje y tracción antagonista para ahorrar tiempo y ganar densidad muscular.",
          },
          {
            id: "mar-e5",
            name: "Gym: B1. Press Landmine Unilateral de pie + B2. Face Pull en Polea",
            setsAndReps: "3 series × 10 reps por brazo + 15 reps salud de hombro",
            restSeconds: 45,
            durationMinutes: 11,
            zone: "Sala Fitness Eurofitness (08:42 - 08:53)",
            tip: "El Landmine transfiere brutalmente a la potencia de pase y protección de balón.",
          },
        ],
      },
      {
        id: "mar-t3",
        tempoNumber: "TEMPO 03",
        title: "Estiramiento Pectoral, Dorsal y Muñecas",
        startTime: "08:53",
        endTime: "09:00",
        durationMinutes: 7,
        phaseType: "cooldown",
        accentColor: "#00F0FF",
        description: "Soltar tensión en hombros y enfriar antes de entrar al vestuario.",
        exercises: [
          {
            id: "mar-e6",
            name: "Colgado pasivo en barra (Dead Hang) + Movilidad torácica",
            setsAndReps: "2 × 40 seg colgado + estiramientos suaves",
            restSeconds: 20,
            durationMinutes: 7,
            zone: "Barra de Dominadas / Esterillas",
            tip: "Descomprime la columna vertebral y abre los hombros antes de ir a clase.",
          },
        ],
      },
      {
        id: "mar-t4",
        tempoNumber: "TEMPO DUCHA",
        title: "Ducha Express & Vestir Outfit Uni",
        startTime: "09:00",
        endTime: "09:10",
        durationMinutes: 10,
        phaseType: "shower",
        accentColor: "#A855F7",
        description: "09:00 en punto al agua. A las 09:10 saliendo por la puerta de Eurofitness hacia la Uni.",
        exercises: [
          {
            id: "mar-e7",
            name: "Ducha express + Cambio a ropa de Universidad (OutfitDiario)",
            setsAndReps: "10 min cronometrados",
            restSeconds: 0,
            durationMinutes: 10,
            zone: "Vestuarios Eurofitness Estació del Nord",
            tip: "Guarda las bambas de básquet aireadas en el compartimento inferior de la mochila.",
          },
        ],
      },
    ],
    extraOutfitPack: {
      packName: "Pack Cancha Básquet + Gym + Ducha Uni",
      outfitDiarioOccasion: "Universidad",
      summary: "Equipación de pista y sala para el entreno híbrido de hoy + Kit de ducha para entrar impecable a las 09:30h en la Uni.",
      items: [
        { id: "m-top", name: "Camiseta de Básquet / Tirantes o técnica", category: "prenda_armario", slotHint: "camiseta", essential: true, reason: "Para los 25 min de pista y 25 min de torso en Gym" },
        { id: "m-short", name: "Pantalón corto de Básquet", category: "prenda_armario", slotHint: "pantalon_corto", essential: true, reason: "Comodidad total en bote y tiro" },
        { id: "m-shoes", name: "Bambas de Básquet (suela indoor limpia)", category: "prenda_armario", slotHint: "zapatos", essential: true, reason: "Agarre en el parqué del Eurofitness" },
        { id: "m-towel-s", name: "Toalla de mano para pista y máquinas", category: "equipo_basquet", essential: true, reason: "Secar manos en tiro y bancos en sala" },
        { id: "m-towel-l", name: "Toalla de ducha + Chanclas + Neceser", category: "ducha_higiene", essential: true, reason: "Ducha express de 09:00 a 09:10h" },
        { id: "m-under", name: "Muda interior limpia + calcetines para el Outfit Uni", category: "muda_uni", essential: true, reason: "Ropa fresca post-ducha" },
      ],
    },
  },

  miercoles: {
    id: "miercoles",
    dayNumber: 3,
    dayName: "Miércoles",
    shortName: "MIÉ",
    environment: "pool",
    facilityZone: "Piscina Climatizada 25m & Zona Hidromasaje",
    headline: "Piscina: Hidromovilidad, Capacidad Aeróbica Suave & Descarga",
    subtitle: "¡HOY HAY DOBLE SESIÓN POR LA NOCHE! (40m Físico + 1h15 Básquet). Por la mañana hacemos agua sin impacto para llegar volando a la noche.",
    intensityPct: 55,
    caloriesEst: 340,
    cnsLoad: "BAJA (Descarga)",
    bgImage: "/bg-pool.png",
    themeAccent: {
      primary: "#00F0FF",
      glow: "rgba(0, 240, 255, 0.35)",
      badgeBg: "rgba(0, 240, 255, 0.14)",
      border: "rgba(0, 240, 255, 0.45)",
    },
    nightBasket: {
      active: true,
      title: "🔥 NOCHE: 40 min Físico Equipo + 1h 15min Entreno Básquet",
      physioDurationMin: 40,
      courtDurationMin: 75,
      totalDurationLabel: "1h 55min totales esta noche",
      loadLevel: "MUY ALTA",
      coachNote: "Alerta de Carga Crítica: Esta noche tienes 40 min de físico exigente + 75 min de pista. El entreno de las 08:00h en la piscina del Eurofitness está diseñado para soltar articulaciones sin gastar glucógeno muscular de las piernas.",
    },
    tempos: [
      {
        id: "mie-t1",
        tempoNumber: "TEMPO 01",
        title: "Aclimatación Acuática & Movilidad de Caderas en Agua",
        startTime: "08:00",
        endTime: "08:08",
        durationMinutes: 8,
        phaseType: "warmup",
        accentColor: "#00F0FF",
        description: "Entrada al agua a las 08:00h: movilidad articular sin gravedad para descomprimir tobillos, rodillas y lumbar.",
        exercises: [
          {
            id: "mie-e1",
            name: "Aperturas dinámicas de cadera en el bordillo + 100m crol largo suave",
            setsAndReps: "4 largos suaves respirando cada 3 brazadas + movilidad",
            restSeconds: 20,
            durationMinutes: 8,
            zone: "Piscina 25m · Carril Lento/Medio",
            tip: "Relaja completamente las piernas; deja que el agua sostenga tu peso.",
          },
        ],
      },
      {
        id: "mie-t2",
        tempoNumber: "TEMPO 02",
        title: "Nado con Pull-Buoy (Cero Fatiga de Piernas) + Hipoxia Controlada",
        startTime: "08:08",
        endTime: "08:53",
        durationMinutes: 45,
        phaseType: "main",
        accentColor: "#00F0FF",
        description: "Usamos Pull-Buoy entre los muslos durante el 70% de la sesión para trabajar pulmón y espalda reservando las piernas al 100% para el físico de esta noche.",
        exercises: [
          {
            id: "mie-e2",
            name: "Bloque 1: Crol con Pull-Buoy (Tracción de dorsal y capacidad pulmonar)",
            setsAndReps: "6 × 50m (respirando cada 3 / 5 brazadas) · Descanso 25s",
            restSeconds: 25,
            durationMinutes: 15,
            zone: "Piscina 25m Eurofitness",
            tip: "Piernas quietas flotando con el pull-buoy: activas espalda y cardio sin cansar cuádriceps.",
          },
          {
            id: "mie-e3",
            name: "Bloque 2: Espalda doble brazo + Braza deslizante (Apertura de pecho)",
            setsAndReps: "6 × 50m alternando Espalda y Braza · Descanso 25s",
            restSeconds: 25,
            durationMinutes: 15,
            zone: "Piscina 25m Eurofitness",
            tip: "El nado de espalda corrige la postura encorvada de estudiar en la Uni.",
          },
          {
            id: "mie-e4",
            name: "Bloque 3: Aquajogging / Movilidad profunda + Hidromasaje activo",
            setsAndReps: "10 min trote flotante sin impacto + 5 min chorros lumbares/gemelos",
            restSeconds: 0,
            durationMinutes: 15,
            zone: "Zona Profunda & Chorros Hidromasaje",
            tip: "Los chorros de agua dejan los gemelos e isquios sueltos y listos para esta noche.",
          },
        ],
      },
      {
        id: "mie-t3",
        tempoNumber: "TEMPO 03",
        title: "Flotación Supina & Respiración Diafragmática",
        startTime: "08:53",
        endTime: "09:00",
        durationMinutes: 7,
        phaseType: "cooldown",
        accentColor: "#00FF87",
        description: "Salir de la piscina a las 08:59h con las pulsaciones bajas directo a las duchas.",
        exercises: [
          {
            id: "mie-e5",
            name: "100m espalda ultra suave + estiramiento en escalera de piscina",
            setsAndReps: "4 largos suaves + salida del vaso a las 08:59",
            restSeconds: 0,
            durationMinutes: 7,
            zone: "Piscina 25m Eurofitness",
            tip: "Escurre bien el bañador al salir para ganar 2 minutos en el vestuario.",
          },
        ],
      },
      {
        id: "mie-t4",
        tempoNumber: "TEMPO DUCHA",
        title: "Ducha Anti-Cloro Express & Outfit Uni",
        startTime: "09:00",
        endTime: "09:10",
        durationMinutes: 10,
        phaseType: "shower",
        accentColor: "#A855F7",
        description: "Aclarado rápido del cloro, hidratación y vestirse el Outfit de Universidad de OutfitDiario.",
        exercises: [
          {
            id: "mie-e6",
            name: "Ducha con gel/champú anti-cloro (4 min) + Vestirse Outfit Uni (6 min)",
            setsAndReps: "Salida a las 09:10h rumbo a clase (09:30h)",
            restSeconds: 0,
            durationMinutes: 10,
            zone: "Vestuarios Eurofitness Estació del Nord",
            tip: "Mete bañador y toalla húmeda en la bolsa impermeable separada.",
          },
        ],
      },
    ],
    extraOutfitPack: {
      packName: "Pack Piscina Mañana + Aviso Doble Sesión Básquet Noche",
      outfitDiarioOccasion: "Universidad",
      summary: "Kit completo de natación para las 08:00h + Muda para tu Outfit de Uni (09:30h) + Recordatorio de tu equipación de Básquet para esta noche (40m físico + 1h15 pista).",
      items: [
        { id: "w-swim", name: "Bañador de natación deportivo", category: "equipo_piscina", essential: true, reason: "Sesión de piscina 08:00 - 09:00h" },
        { id: "w-cap", name: "Gorro de piscina + Gafas antivaho", category: "equipo_piscina", essential: true, reason: "Obligatorio en la piscina del Eurofitness Estació del Nord" },
        { id: "w-flip", name: "Chanclas de piscina antideslizantes", category: "equipo_piscina", essential: true, reason: "Obligatorias en playa de piscina y duchas" },
        { id: "w-towel", name: "Toalla grande de microfibra + Bolsa estanca ropa mojada", category: "ducha_higiene", essential: true, reason: "Para guardar el bañador húmedo sin mojar los apuntes de la Uni" },
        { id: "w-soap", name: "Gel/Champú anti-cloro + desodorante", category: "ducha_higiene", essential: true, reason: "Ducha express 09:00 - 09:10h" },
        { id: "w-under", name: "Muda interior limpia para el Outfit de Universidad", category: "muda_uni", essential: true, reason: "Transición de bañador a ropa de calle" },
        { id: "w-night", name: "🌙 EXTRA NOCHE: Equipación Básquet + Bambas (40m Físico + 1h15 Pista)", category: "equipo_basquet", slotHint: "camiseta", essential: true, reason: "Dejar lista para el entreno doble de esta noche con el equipo" },
      ],
    },
  },

  jueves: {
    id: "jueves",
    dayNumber: 4,
    dayName: "Jueves",
    shortName: "JUE",
    environment: "pool",
    facilityZone: "Zona Funcional (20m) + Piscina & Contrastes (40m)",
    headline: "Recuperación Post-Miércoles: Core, Movilidad & Agua",
    subtitle: "Tras la paliza de anoche (40m físico + 1h15 básquet), hoy limpiamos ácido láctico con movilidad en esterilla y regeneración en la piscina.",
    intensityPct: 60,
    caloriesEst: 360,
    cnsLoad: "BAJA (Descarga)",
    bgImage: "/bg-pool.png",
    themeAccent: {
      primary: "#00F0FF",
      glow: "rgba(0, 240, 255, 0.35)",
      badgeBg: "rgba(0, 240, 255, 0.14)",
      border: "rgba(0, 240, 255, 0.45)",
    },
    nightBasket: {
      active: false,
      title: "Recuperación para el Viernes",
      physioDurationMin: 0,
      courtDurationMin: 0,
      totalDurationLabel: "Tarde libre de recuperación",
      loadLevel: "DESCANSO",
      coachNote: "Venimos de las casi 2 horas de anoche. Esta sesión elimina la rigidez muscular de piernas y espalda baja para que mañana viernes vuelvas a estar rápido.",
    },
    tempos: [
      {
        id: "jue-t1",
        tempoNumber: "TEMPO 01",
        title: "Liberación Miofascial (Foam Roller) & Desbloqueo Cadera",
        startTime: "08:00",
        endTime: "08:08",
        durationMinutes: 8,
        phaseType: "warmup",
        accentColor: "#00FF87",
        description: "8 minutos en la zona de estiramientos para soltar fascia lata, gemelos y espalda tras la noche del miércoles.",
        exercises: [
          {
            id: "jue-e1",
            name: "Foam Roller en cuádriceps, isquios, gemelos y columna torácica",
            setsAndReps: "4 min rodillo + 4 min estiramiento dinámico World's Greatest Stretch",
            restSeconds: 0,
            durationMinutes: 8,
            zone: "Zona Estiramientos / Funcional",
            tip: "Respira profundo en los puntos de gatillo cargados del entreno de anoche.",
          },
        ],
      },
      {
        id: "jue-t2",
        tempoNumber: "TEMPO 02",
        title: "Core Estabilizador (15 min) + Piscina Regenerativa (30 min)",
        startTime: "08:08",
        endTime: "08:53",
        durationMinutes: 45,
        phaseType: "main",
        accentColor: "#00F0FF",
        description: "15 min de trabajo abdominal/glúteo medio y a las 08:23 bajamos directo a la piscina para 30 min de descarga acuática.",
        exercises: [
          {
            id: "jue-e2",
            name: "Circuito Core McGill Big 3: Bird-Dog + Side Plank + Dead Bug",
            setsAndReps: "3 vueltas controladas sin fatiga lumbar (15 min)",
            restSeconds: 30,
            durationMinutes: 15,
            zone: "Zona Funcional (08:08 - 08:23)",
            tip: "Protege la zona lumbar después de los impactos de ayer en cancha.",
          },
          {
            id: "jue-e3",
            name: "Piscina: 400m Nado variado suave (Crol + Espalda largo)",
            setsAndReps: "8 × 50m a ritmo aeróbico regenerativo · Descanso 20s",
            restSeconds: 20,
            durationMinutes: 18,
            zone: "Piscina 25m Eurofitness (08:23 - 08:41)",
            tip: "La presión hidrostática del agua drena la inflamación de tobillos y rodillas.",
          },
          {
            id: "jue-e4",
            name: "Piscina: Patada suave con tabla + Chorros de descarga muscular",
            setsAndReps: "4 × 25m patada suelta + 6 min hidromasaje en piernas",
            restSeconds: 15,
            durationMinutes: 12,
            zone: "Piscina & Hidromasaje (08:41 - 08:53)",
            tip: "Sales del agua con las piernas como nuevas.",
          },
        ],
      },
      {
        id: "jue-t3",
        tempoNumber: "TEMPO 03",
        title: "Contraste Térmico & Relajación",
        startTime: "08:53",
        endTime: "09:00",
        durationMinutes: 7,
        phaseType: "cooldown",
        accentColor: "#00F0FF",
        description: "Estiramiento de psoas e isquios en el agua y salida hacia vestuarios.",
        exercises: [
          {
            id: "jue-e5",
            name: "Estiramiento asistido en pared de piscina + salida al vestuario",
            setsAndReps: "7 min suaves",
            restSeconds: 0,
            durationMinutes: 7,
            zone: "Piscina 25m Eurofitness",
            tip: "Sal del vaso a las 08:59h para cumplir el Tempo de ducha.",
          },
        ],
      },
      {
        id: "jue-t4",
        tempoNumber: "TEMPO DUCHA",
        title: "Ducha de Contraste & Outfit Uni",
        startTime: "09:00",
        endTime: "09:10",
        durationMinutes: 10,
        phaseType: "shower",
        accentColor: "#A855F7",
        description: "Ducha alternando 1 min caliente / 30 seg fría en piernas y vestir el Outfit de Universidad.",
        exercises: [
          {
            id: "jue-e6",
            name: "Ducha anti-cloro con contraste en piernas (4 min) + Vestirse (6 min)",
            setsAndReps: "Salida puntual 09:10h -> Entrada Uni 09:30h",
            restSeconds: 0,
            durationMinutes: 10,
            zone: "Vestuarios Eurofitness Estació del Nord",
            tip: "El contraste frío final activa la circulación y te deja despierto para clase.",
          },
        ],
      },
    ],
    extraOutfitPack: {
      packName: "Pack Mixto Core + Piscina Regenerativa + Ducha Uni",
      outfitDiarioOccasion: "Universidad",
      summary: "Ropa ligera para los 15 min de Core/Foam Roller + Kit de Piscina para los 30 min de agua + Cambio completo al Outfit de Universidad.",
      items: [
        { id: "j-swim", name: "Bañador de natación (puedes llevarlo ya puesto debajo del pantalón corto)", category: "equipo_piscina", essential: true, reason: "Ahorras 3 min en la transición de las 08:23h a la piscina" },
        { id: "j-top", name: "Camiseta ligera para los 15 min de Core/Movilidad", category: "prenda_armario", slotHint: "camiseta", essential: true, reason: "Para la zona funcional antes de bajar al agua" },
        { id: "j-cap", name: "Gorro de piscina + Gafas + Chanclas", category: "equipo_piscina", essential: true, reason: "Imprescindible para el bloque acuático" },
        { id: "j-towel", name: "Toalla pequeña (esterilla) + Toalla grande de ducha", category: "ducha_higiene", essential: true, reason: "Para zona funcional y ducha de las 09:00h" },
        { id: "j-soap", name: "Neceser ducha + Bolsa impermeable", category: "ducha_higiene", essential: true, reason: "Guardar bañador y salir limpio a la Uni" },
        { id: "j-under", name: "Muda interior limpia + calcetines de calle", category: "muda_uni", essential: true, reason: "Para estrenar tras la ducha con el Outfit de Universidad" },
      ],
    },
  },

  viernes: {
    id: "viernes",
    dayNumber: 5,
    dayName: "Viernes",
    shortName: "VIE",
    environment: "basket",
    facilityZone: "Pista Básquet Eurofitness + Zona Funcional (Activación PAP)",
    headline: "Primer (Activación Neuromuscular) & Tiro de Partido",
    subtitle: "¡HOY HAY 1h 15min DE BÁSQUET POR LA NOCHE! Por la mañana hacemos una sesión 'Primer' de 60 min: chispa rápida, tiro real y cero fatiga.",
    intensityPct: 75,
    caloriesEst: 410,
    cnsLoad: "MEDIA (Técnica/PAP)",
    bgImage: "/bg-basket.png",
    themeAccent: {
      primary: "#FF6B00",
      glow: "rgba(255, 107, 0, 0.35)",
      badgeBg: "rgba(255, 107, 0, 0.14)",
      border: "rgba(255, 107, 0, 0.45)",
    },
    nightBasket: {
      active: true,
      title: "🏀 NOCHE: 1h 15min Entreno de Básquet con el Equipo",
      physioDurationMin: 0,
      courtDurationMin: 75,
      totalDurationLabel: "1h 15min de pista esta noche",
      loadLevel: "ALTA",
      coachNote: "Los jugadores NBA hacen un 'Morning Shootaround + CNS Primer' el mismo día de entreno fuerte o partido: pocas repeticiones muy explosivas y mucho tiro para que por la noche tengas el sistema nervioso encendido y la muñeca calibrada.",
    },
    tempos: [
      {
        id: "vie-t1",
        tempoNumber: "TEMPO 01",
        title: "Encendido del Sistema Nervioso (CNS Wake-Up)",
        startTime: "08:00",
        endTime: "08:08",
        durationMinutes: 8,
        phaseType: "warmup",
        accentColor: "#FF6B00",
        description: "Movilidad rápida de cadera/tobillo y primeros toques de balón en la pista del Eurofitness.",
        exercises: [
          {
            id: "vie-e1",
            name: "Skipping reactivo + Sprints cortos al 70% + Bote en movimiento",
            setsAndReps: "8 min progresivos en media pista",
            restSeconds: 20,
            durationMinutes: 8,
            zone: "Pista Básquet Eurofitness",
            tip: "Buscamos sensación de ligereza y pies rápidos.",
          },
        ],
      },
      {
        id: "vie-t2",
        tempoNumber: "TEMPO 02",
        title: "Micro-Dosis Explosiva (15 min) + Shootaround de Partido (30 min)",
        startTime: "08:08",
        endTime: "08:53",
        durationMinutes: 45,
        phaseType: "main",
        accentColor: "#00FF87",
        description: "Pocas repeticiones con descanso completo para potenciar fibras rápidas sin agujetas, seguido de 30 min de tiro y situaciones reales.",
        exercises: [
          {
            id: "vie-e2",
            name: "Activación PAP: Lanzamientos Balón Medicinal + Saltos Verticales Libres",
            setsAndReps: "3 series × (4 lanzamientos pecho/suelo + 3 saltos máximos) · Descanso largo 90s",
            restSeconds: 90,
            durationMinutes: 15,
            zone: "Zona Funcional / Pista (08:08 - 08:23)",
            tip: "Cero fatiga: solo 3-4 repeticiones a máxima chispa para 'despertar' la potencia para esta noche.",
          },
          {
            id: "vie-e3",
            name: "Shootaround: Tiro tras salida de bloqueo + Flotadoras + Tiros Libres en fatiga",
            setsAndReps: "Series de 7 aciertos por posición + 2 tiros libres entre series (30 min)",
            restSeconds: 20,
            durationMinutes: 30,
            zone: "Pista Básquet Eurofitness (08:23 - 08:53)",
            tip: "Visualiza las jugadas que harás esta noche en el entreno de 1h15 con tu equipo.",
          },
        ],
      },
      {
        id: "vie-t3",
        tempoNumber: "TEMPO 03",
        title: "Tiros Libres de Cierre & Estiramiento Dinámico",
        startTime: "08:53",
        endTime: "09:00",
        durationMinutes: 7,
        phaseType: "cooldown",
        accentColor: "#00F0FF",
        description: "Anotar 10 tiros libres seguidos limpios y estirar suave antes de ir a la ducha.",
        exercises: [
          {
            id: "vie-e4",
            name: "Reto 10 Tiros Libres + movilidad suave de isquios y gemelos",
            setsAndReps: "7 min de vuelta a la calma",
            restSeconds: 0,
            durationMinutes: 7,
            zone: "Pista Básquet Eurofitness",
            tip: "Terminar con buena sensación de muñeca te da confianza automática por la noche.",
          },
        ],
      },
      {
        id: "vie-t4",
        tempoNumber: "TEMPO DUCHA",
        title: "Ducha Express & Outfit Uni de Viernes",
        startTime: "09:00",
        endTime: "09:10",
        durationMinutes: 10,
        phaseType: "shower",
        accentColor: "#A855F7",
        description: "Ducha rápida de 09:00 a 09:10, vestir el Outfit de Viernes generado en OutfitDiario y rumbo a la Uni.",
        exercises: [
          {
            id: "vie-e5",
            name: "Ducha express (4 min) + Vestirse Outfit Uni (6 min)",
            setsAndReps: "Salida vestuario: 09:10h -> Entrada Uni: 09:30h",
            restSeconds: 0,
            durationMinutes: 10,
            zone: "Vestuarios Eurofitness Estació del Nord",
            tip: "Deja la ropa de esta mañana aireando o usa un segundo conjunto limpio para el entreno de 1h15 de esta noche.",
          },
        ],
      },
    ],
    extraOutfitPack: {
      packName: "Pack Shootaround Mañana + Entreno Básquet Noche (1h15)",
      outfitDiarioOccasion: "Universidad",
      summary: "Equipación de pista para la sesión de activación (08:00-09:00) + Kit de Ducha Uni + Segundo set de Básquet para el entreno de equipo de esta noche.",
      items: [
        { id: "v-top", name: "Camiseta de Básquet / Entreno (Mañana 08:00h)", category: "prenda_armario", slotHint: "camiseta", essential: true, reason: "Para el Shootaround en Eurofitness Estació del Nord" },
        { id: "v-short", name: "Pantalón corto de Básquet", category: "prenda_armario", slotHint: "pantalon_corto", essential: true, reason: "Sesión de tiro y activación" },
        { id: "v-shoes", name: "Bambas de Básquet", category: "prenda_armario", slotHint: "zapatos", essential: true, reason: "Tracción en parqué" },
        { id: "v-towel", name: "Toalla de ducha + Chanclas + Neceser", category: "ducha_higiene", essential: true, reason: "Ducha de 09:00 a 09:10h antes de la Uni" },
        { id: "v-under", name: "Muda interior limpia + calcetines de calle", category: "muda_uni", essential: true, reason: "Para tu Outfit de Viernes en la Universidad" },
        { id: "v-night", name: "🏀 EXTRA NOCHE: Camiseta Reversible + Calcetines técnicos (Entreno 1h15)", category: "equipo_basquet", slotHint: "camiseta", essential: true, reason: "Para el entrenamiento de 1h 15min de esta noche con el equipo" },
      ],
    },
  },
};

export const ORDERED_DAYS: DayId[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];

export function getTodayDayId(): DayId {
  const jsDay = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  switch (jsDay) {
    case 1:
      return "lunes";
    case 2:
      return "martes";
    case 3:
      return "miercoles";
    case 4:
      return "jueves";
    case 5:
      return "viernes";
    default:
      // Si es fin de semana, mostramos el Lunes listo para empezar la semana
      return "lunes";
  }
}
