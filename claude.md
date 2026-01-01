# TRCalc - Project Context

## Overview
Mobile-first currency calculator built with Next.js (Pages Router) and TypeScript. Converts between USD and a user-selected target currency (TRY, EUR, GBP) with bidirectional display.

## Tech Stack
- Next.js 14 (Pages Router)
- TypeScript
- Tailwind CSS
- Open Exchange Rates API
- localStorage for caching, settings, and history

## Key Conventions

### No Decimals
All values are integers. No decimal input, no decimal display. Use `Intl.NumberFormat` with `maximumFractionDigits: 0`.

### Number Formatting
Always format numbers with thousands separators (e.g., `1,234,567`).

### localStorage Keys
- `trcalc-settings` - User preferences
- `trcalc-history` - Calculation history
- `trcalc-rates` - Cached exchange rates

### Component Structure
```
src/
├── pages/
│   ├── index.tsx        # Calculator page
│   ├── settings.tsx     # Settings page
│   └── api/exchange-rate.ts
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
└── types/
    └── index.ts
```

## UI Guidelines

### Display Component
Single table combining input + output:
- Left cell: merged, editable input (neutral bg)
- Right top: USD row with blue background
- Right bottom: Target currency row with amber background
- Calculated values are bold and emphasized

### Keypad
4x4 grid, no decimal button. Zero spans 3 columns.
Keys: 7,8,9,C | 4,5,6,⌫ | 1,2,3,= | 0,=

### Multiplier Buttons
Dynamic list of percentage modifiers. Default: +KDV (18%), -KDV (-18%), +OTV25 (25%).
User can add/remove in settings.

### Quick Values
Row of preset amounts (default: 50, 100, 500, 1000). User-configurable.

## API

### Environment Variables
```
OPEN_EXCHANGE_RATES_APP_ID=your_api_key
```

### Exchange Rate Endpoint
`GET /api/exchange-rate` - Returns rates for USD, EUR, GBP, TRY.
Client caches in localStorage for 1 hour.

## Features

### Auto-Reset
When enabled, if app loses focus and regains it, the next keypress saves current calculation to history and starts fresh.

### First Visit
No separate setup screen. Settings page shows welcome message on first visit.
