# NutriPlan — Frontend

App web **mobile-first** de planificación de comidas semanal. Un solo usuario, sin autenticación.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript 5
- **Tailwind CSS v4** + shadcn/ui + Base UI
- **lucide-react** para iconos
- `clsx` + `tailwind-merge` + `class-variance-authority` para estilos condicionales

## Estructura

```
src/
├── app/          # Rutas (App Router) — layouts, pages, loading, error
├── components/
│   ├── layout/   # AppShell, BottomNav, Header, FabAdd
│   └── ui/       # Componentes base shadcn (badge, button, card, dialog…)
├── features/     # Módulos por dominio (ingredientes, recetas, planificador…)
└── lib/
    ├── api-client.ts   # Cliente HTTP centralizado → BASE_URL/api/*
    ├── date.ts
    ├── format.ts
    └── utils.ts        # cn() helper
```

## API

El backend corre en `http://localhost:4000`. Todas las llamadas van a través de `src/lib/api-client.ts`:

```ts
api.get<T>(path)
api.post<T>(path, body)
api.put<T>(path, body)
api.delete<T>(path)
```

Variable de entorno: `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)

## Sistema de diseño

Sistema definido en `/DESIGN.md` (raíz del proyecto, fuera del frontend).

**Paleta principal:**
- `primary`: `#006398` / `primary-container`: `#64B5F6`
- `background`: `#F9F9F9` / `surface`: `#FFFFFF`
- `on-surface`: `#1A1C1C`

**Tipografía:**
- Headlines → **Manrope** (700/600)
- Body & labels → **Inter** (400/500/600)

**Bordes redondeados:** 8px estándar, 16px cards grandes, pill en botones y chips.

**Sombras:** Ambiente suave — `0px 4px 20px rgba(0,0,0,0.04)`. Sin bordes fuertes.

**Layout:** Columna única en mobile, máx. 1200px centrado en desktop. Gutters de 16px, margin mobile 20px.

## Comandos

```bash
npm run dev      # Desarrollo (puerto 3000)
npm run build    # Build de producción
npm run lint     # ESLint
```

## Convenciones

- **No hay autenticación** — todas las rutas son accesibles.
- Cada feature vive en `src/features/<dominio>/` con sus propios componentes, hooks y types.
- Componentes `ui/` son genéricos y reutilizables; los de `features/` son específicos del dominio.
- Mobile-first: diseñar primero para 375px, luego escalar.
- No añadir comentarios salvo que el "por qué" no sea obvio.

## Git workflow

- Rama de integración: `develop`
- Nunca pushear directo a `main` — siempre PR apuntando a `develop`
- Naming de ramas: `FEAT-XXX-nombre` / `FIX-XXX-nombre` (coincide con ID de tarea en Notion)
- Antes de cualquier commit o push, confirmar con el usuario

## Notion

Board: [NutriPlan Development Tasks](https://www.notion.so/259922cafbcc4015b197be7ddbe2e2c4)

Actualizar proactivamente:
- Al empezar → `In Progress`
- Al crear PR → `Review` + URL de la PR
- Al mergear → `Done`
