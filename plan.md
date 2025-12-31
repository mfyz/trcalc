# Currency Calculator - Implementation Plan

## Project Overview
A mobile-first currency converter built with Next.js and TypeScript. Calculator-style UI with single input showing bidirectional conversion between USD and a target currency (default: TRY). Includes custom buttons for tax rates and quick values.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| API | Open Exchange Rates |
| Caching | localStorage only (client-side) |
| Storage | localStorage (settings, history, rates) |
| Deployment | Vercel |

---

## Supported Currencies

| Code | Currency |
|------|----------|
| USD | US Dollar |
| EUR | Euro |
| GBP | British Pound |
| TRY | Turkish Lira |

---

## UI Mockup (ASCII)

### Main Calculator

```
┌─────────────────────────────────────┐
│  ⚙️ Settings          🔄 Auto-Reset │
├─────────────────────────────────────┤
│                                     │
│    USD ↔ TRY   Rate: 34.52          │
│    Updated: 5 min ago               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────┬───────────────────┐ │
│  │            │ $1,500 ▶ ₺51,780  │ │  ← USD (bg: blue)
│  │   1,500    ├───────────────────┤ │  ← INPUT here
│  │            │ ₺1,500 ▶ $43      │ │  ← TRY (bg: amber)
│  └────────────┴───────────────────┘ │
│    ↑ input      ↑ source  ↑ result  │
│   (editable)    (muted)   (bold)    │
│                                     │
├─────────────────────────────────────┤
│  Multipliers                        │
│  ┌───────┐ ┌───────┐ ┌────────┐    │
│  │ +KDV  │ │ -KDV  │ │ +OTV25 │ ...│
│  └───────┘ └───────┘ └────────┘    │
│                                     │
│  Quick Values                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 50  │ │ 100 │ │ 500 │ │1000 │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │  7  │ │  8  │ │  9  │ │  C  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │  4  │ │  5  │ │  6  │ │  ⌫  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │  1  │ │  2  │ │  3  │ │     │   │
│  └─────┘ └─────┘ └─────┘ │  =  │   │
│  ┌─────────────────────┐ │     │   │
│  │          0          │ │     │   │
│  └─────────────────────┘ └─────┘   │
│                                     │
├─────────────────────────────────────┤
│  📜 History                         │
│  ─────────────────────────────────  │
│  100: $100→₺3,452 | ₺100→$2.90  2m  │
│  50 (+KDV): $59→₺2,036 | ...    5m  │
└─────────────────────────────────────┘
```

### Display Styling

| Element | Style |
|---------|-------|
| Input cell (merged left) | Large font, neutral bg (gray-100), editable, formatted with commas |
| Source amount ($1,500, ₺1,500) | Normal weight, muted text color |
| Arrow (▶) | Small, muted |
| Calculated result (₺51,780, $43) | **Bold**, larger font, high contrast |
| USD row (right cell) | Light blue background (blue-50) |
| TRY row (right cell) | Light amber background (amber-50) |

### Number Formatting

- All values formatted with thousands separator (e.g., `1,234,567`)
- No decimal places displayed
- Use `Intl.NumberFormat` for locale-aware formatting

### Settings Screen

```
┌─────────────────────────────────────┐
│  ← Back                  Settings   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👋 Welcome! Configure your  │    │
│  │ calculator preferences.     │    │  ← Shows on first visit
│  └─────────────────────────────┘    │
│                                     │
│  TARGET CURRENCY                    │
│  ┌─────────────────────────────┐    │
│  │ 🇹🇷 TRY - Turkish Lira    ▼ │    │
│  └─────────────────────────────┘    │
│                                     │
│  AUTO-RESET                         │
│  ┌──┐                               │
│  │✓ │ Reset on app refocus          │
│  └──┘                               │
│  When enabled, typing after         │
│  returning saves current calc       │
│  to history and starts fresh.       │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  MULTIPLIER BUTTONS                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ +KDV       │ 18%        [x] │    │
│  ├─────────────────────────────┤    │
│  │ -KDV       │ -18%       [x] │    │
│  ├─────────────────────────────┤    │
│  │ +OTV25     │ 25%        [x] │    │
│  └─────────────────────────────┘    │
│                                     │
│  [ + Add Multiplier ]               │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  QUICK VALUES                       │
│  (comma-separated)                  │
│  ┌─────────────────────────────┐    │
│  │ 50, 100, 500, 1000          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [ Clear History ]                  │
│                                     │
└─────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Project Setup

1. **Initialize Next.js project with TypeScript**
   - `npx create-next-app@latest --typescript`
   - Configure Tailwind CSS
   - Set up project structure

2. **Project structure**
   ```
   src/
   ├── pages/
   │   ├── _app.tsx
   │   ├── _document.tsx
   │   ├── index.tsx
   │   ├── settings.tsx
   │   └── api/
   │       └── exchange-rate.ts
   ├── components/
   │   ├── Calculator.tsx
   │   ├── Keypad.tsx
   │   ├── Display.tsx
   │   ├── MultiplierButtons.tsx
   │   ├── QuickValues.tsx
   │   └── History.tsx
   ├── hooks/
   │   ├── useLocalStorage.ts
   │   ├── useFocusDetection.ts
   │   └── useExchangeRate.ts
   ├── lib/
   │   └── currency-api.ts
   ├── styles/
   │   └── globals.css
   └── types/
       └── index.ts
   ```

### Phase 2: Backend API Route

1. **Create API route** (`/api/exchange-rate`)
   - Fetch rates from Open Exchange Rates
   - No server caching - just proxy to external API
   - Return rates for USD, EUR, GBP, TRY

2. **Environment variables**
   ```
   OPEN_EXCHANGE_RATES_APP_ID=your_api_key
   ```

3. **Client-side caching**
   - Cache rates in localStorage with timestamp
   - Refresh if cache is > 1 hour old
   - Show "last updated" time to user

### Phase 3: Frontend Components

1. **Calculator component**
   - Single table combining input + output:
     - Left cell: merged, editable input (neutral bg, large font)
     - Right top: USD row → "$X ▶ ₺Y" (blue bg, result bold)
     - Right bottom: TRY row → "₺X ▶ $Y" (amber bg, result bold)
   - Keypad updates the input cell value
   - Calculated values emphasized with bold + larger font

2. **Multiplier buttons**
   - Dynamic list of percentage modifiers
   - Default: +KDV (18%), -KDV (-18%), +OTV25 (25%)
   - User can add/remove/edit in settings

3. **Quick values**
   - Row of preset amounts (e.g., 50, 100, 500, 1000)
   - Smaller buttons, user-configurable in settings

4. **History component**
   - List of previous calculations
   - Shows: input, both conversions, modifier applied, timestamp
   - Stored in localStorage

### Phase 4: Core Features

1. **Settings page**
   - Shows welcome message on first visit (no separate setup screen)
   - Target currency selector (EUR, GBP, TRY)
   - Auto-reset toggle
   - Multiplier buttons: add/edit/delete (label + percentage)
   - Quick values input (comma-separated)
   - Clear history option

2. **Focus detection & auto-reset**
   - Track `visibilitychange` event
   - If auto-reset enabled AND app was hidden:
     - On first keypress: save current to history, start fresh
   - Toggle in header + settings

3. **Calculation history**
   - Auto-save each calculation to localStorage
   - Store: input, USD result, target result, modifier, timestamp
   - Show in collapsible history panel

4. **localStorage schema**
   ```typescript
   // Settings
   {
     targetCurrency: "TRY" | "EUR" | "GBP",
     autoReset: boolean,
     firstVisit: boolean,
     multipliers: [
       { id: string, label: "+KDV", value: 18 },
       { id: string, label: "-KDV", value: -18 },
       { id: string, label: "+OTV25", value: 25 }
       // ... user can add more
     ],
     quickValues: [50, 100, 500, 1000]
   }

   // History
   [
     {
       id: string,
       inputValue: number,
       usdAmount: number,
       targetAmount: number,
       targetCurrency: "TRY" | "EUR" | "GBP",
       rate: number,
       modifier: { label: string, value: number } | null,
       timestamp: number
     }
   ]

   // Rate cache
   {
     rates: { USD: 1, EUR: number, GBP: number, TRY: number },
     timestamp: number
   }
   ```

### Phase 5: Polish & Deploy

1. **Performance**
   - localStorage caching for rates (1 hour TTL)
   - Minimal re-renders with proper state management

2. **Deployment**
   - Configure `OPEN_EXCHANGE_RATES_APP_ID` on Vercel
   - Deploy to Vercel

---

## API: Open Exchange Rates

- **Endpoint**: `https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID`
- **Free tier**: 1,000 requests/month
- **Response**: All rates relative to USD (base)

---

## Key Files to Create

1. `src/pages/index.tsx` - Main calculator page
2. `src/pages/settings.tsx` - Settings page (with first-visit welcome)
3. `src/pages/_app.tsx` - App wrapper with global styles
4. `src/pages/api/exchange-rate.ts` - Backend API route
5. `src/components/Calculator.tsx` - Main calculator component
6. `src/components/Keypad.tsx` - Number pad UI
7. `src/components/Display.tsx` - Bidirectional table with merged input cell
8. `src/components/MultiplierButtons.tsx` - Dynamic percentage multipliers
9. `src/components/QuickValues.tsx` - Preset amount buttons
10. `src/components/History.tsx` - Calculation history
11. `src/hooks/useLocalStorage.ts` - localStorage hook
12. `src/hooks/useFocusDetection.ts` - App focus/blur detection
13. `src/hooks/useExchangeRate.ts` - Rate fetching with cache
14. `src/lib/currency-api.ts` - API client utilities
15. `src/types/index.ts` - TypeScript interfaces

---

## Mobile-First Design Notes

- Viewport meta tag for proper scaling
- Min-height buttons of 48px (touch target)
- Full-width fluid layout
- Large, readable font sizes (16px+ to prevent zoom on iOS)
- Calculator-style grid layout for keypad
- Single-column layout optimized for thumb reach
- Quick value buttons smaller than keypad buttons
