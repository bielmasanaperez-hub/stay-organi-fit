# StayOrganiFit ⚡🏊‍♂️🏀🏋️‍♂️

Aplicación Web Progresiva (PWA) futurista diseñada para gestionar tu entrenamiento matutino de **Lunes a Viernes (08:00 – 09:00h + Ducha Express 09:00 – 09:10h)** en el **CEM Eurofitness Estació del Nord (Barcelona)** antes de entrar a la Universidad a las **09:30h**, sincronizada con tus entrenamientos nocturnos de **Básquet** y con tu aplicación **OutfitDiario**.

---

## ✨ Características Principales

1. **Sistema de Tempos Matutinos (08:00 – 09:10h):**
   - **Tempo 01 (08:00 – 08:08):** Activación y movilidad específica.
   - **Tempo 02 (08:08 – 08:53):** Bloque principal de alta eficiencia (45 min cronometrados).
   - **Tempo 03 (08:53 – 09:00):** Vuelta a la calma / descompresión.
   - **Tempo Ducha (09:00 – 09:10):** Ducha express y transición al Outfit de Universidad para llegar a las 09:30h.
   - Incluye cronómetro interactivo con alertas sonoras Web Audio y botones rápidos de descanso entre series (`30s`, `60s`, `90s`).

2. **Planificación Inteligente en Eurofitness Estació del Nord + Básquet Nocturno:**
   - **Lunes (Sala Fitness Gym):** Fuerza Explosiva, Potencia de Salto Vertical & Core.
   - **Martes (Pista Básquet + Gym):** 25 min Técnica de Tiro/Bote en pista + 25 min Fuerza Tren Superior.
   - **Miércoles (Piscina 25m):** Hidromovilidad, Pull-Buoy (cero fatiga en piernas) y descarga activa porque **por la noche tienes 40 min de Físico + 1h 15min de Básquet con el equipo**.
   - **Jueves (Funcional + Piscina Regenerativa):** Foam Roller, Core estabilizador y 30 min de agua para limpiar ácido láctico tras el miércoles noche.
   - **Viernes (Pista Básquet + Activación PAP):** Sesión *CNS Primer* + Shootaround sin fatiga para llegar al 100% al **entreno de 1h 15min de Básquet de los viernes noche**.

3. **Conexión Bidireccional con `OutfitDiario`:**
   - Configura automáticamente cada mañana tu **Outfit Extra Deportivo + Kit de Ducha (09:00-09:10) + Muda limpia para la Uni**.
   - Los **Miércoles y Viernes** reserva automáticamente un **2º conjunto limpio de Básquet** para tu sesión nocturna con el equipo.
   - Al terminar el entreno a las 09:00h, envía con 1 clic las prendas deportivas usadas directamente a **Lavado (5 días)** en **OutfitDiario**.

---

## 🚀 Arrancar en Local

```bash
npm install
npm run dev
```

Abre `http://localhost:3001` (configurado en el puerto `3001` para que pueda correr simultáneamente junto a `OutfitDiario` en el puerto `3000`).

---

## 📱 Subir a GitHub y Conectar con Vercel (Actualización Automática en el Móvil)

1. Sube este repositorio a tu cuenta de GitHub (`bielmasanaperez-hub/stay-organi-fit`).
2. Entra en [vercel.com](https://vercel.com), pulsa **"Add New Project"** e importa el repositorio `stay-organi-fit`.
3. Pulsa **Deploy**.
4. En tu móvil (iPhone / Android), abre la URL de Vercel y selecciona **"Añadir a la pantalla de inicio"**: se instalará como aplicación nativa a pantalla completa y se actualizará automáticamente cada vez que hagas cambios en GitHub.
