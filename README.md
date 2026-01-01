# TRCalc

A mobile-first currency calculator PWA, optimized for quick conversions.

## The Story

I'm a Turkish techie living in New York, regularly traveling back to Turkey. With the country's challenging economy and ridiculously high inflation rates, it's exhausting to keep up with how much anything actually costs—especially for someone living abroad.

I found myself constantly typing "XXX TRY in USD" into Google. Fortunately, Google smartly converts these queries in its results. But doing this 20+ times a day? That gets old fast.

So I vibe-coded this mini web app to add to my phone's home screen. It's optimized for one thing: pop it open and start typing. No friction, no ads, no bloat—just instant currency conversion.

## Features

- **Mobile-first PWA** - Add to home screen for app-like experience
- **Instant conversion** - Start typing immediately, see results in real-time
- **Bidirectional** - Swap between USD and target currency with one tap
- **Multiplier buttons** - Quick tax calculations (+KDV 18%, -KDV, +OTV25, etc.)
- **Quick values** - Preset amounts for common conversions
- **History** - Track your recent calculations
- **Auto-reset** - Optionally save to history when switching apps
- **Dark mode** - System, light, or dark theme support
- **Offline-friendly** - Caches exchange rates locally
- **No account required** - Everything stored locally in your browser

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (Pages Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Open Exchange Rates API](https://openexchangerates.org/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/user/trcalc.git
cd trcalc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Open Exchange Rates API key to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```
OPEN_EXCHANGE_RATES_APP_ID=your_api_key_here
```

Get a free API key at [Open Exchange Rates](https://openexchangerates.org/).

## Usage

1. Open the app and start typing numbers
2. See instant conversion to your target currency
3. Tap the swap button to reverse direction
4. Use multiplier buttons for tax calculations
5. Tap quick values for common amounts
6. View history by tapping the history section

### Adding to Home Screen

**iOS Safari:**
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android Chrome:**
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"

## Contributing

Contributions are welcome! Here's how you can help:

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Guidelines

- **Keep it simple** - This app is intentionally minimal. Think twice before adding complexity.
- **Mobile-first** - Test on mobile devices. The primary use case is quick phone lookups.
- **No breaking changes** - Settings and history are stored in localStorage. Don't break existing users.
- **TypeScript** - Maintain type safety. No `any` types unless absolutely necessary.
- **Test your changes** - Make sure the app works on iOS Safari (PWA mode) and Android Chrome.

### Ideas for Contributions

- Additional currency support
- Improved offline handling
- Accessibility improvements
- Performance optimizations
- Bug fixes

### Reporting Issues

Found a bug? Have a suggestion? Open an issue with:
- Clear description of the problem or idea
- Steps to reproduce (for bugs)
- Device/browser information

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Made with mass mass mass mass amount of mass amounts of mass amounts of Claude tokens in NYC.
