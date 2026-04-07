# Goodbye Chat

A privacy-first Snapchat archive viewer. Import your Snapchat data, explore your memories, get AI-powered insights, and export to Immich.

> "Say goodbye and archive a digital chapter in your life."

## Features

- **Import**: Drag-and-drop your Snapchat Takeout archive
- **Local-first**: All processing happens in your browser—no data sent to servers
- **No login**: No account required, no tracking
- **Memories explorer**: Filter by type, friend, year, saved status
- **AI insights**: Pattern matching and heuristics to highlight meaningful moments
- **Export ready**: Prepare your archive for Immich or download as JSON
- **Open source**: Auditable, privacy-first design

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page with trust signals and how it works |
| `/import` | Drag-and-drop archive import |
| `/processing` | Local processing progress indicator |
| `/dashboard` | Archive stats, timeline, highlights |
| `/memories` | Browse and filter memories |
| `/summary` | AI-powered insights (with consent) |
| `/export` | Export to Immich or JSON |
| `/privacy` | Privacy commitment and about |

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Vue Router
- Pinia

## Privacy

This is a client-only application. When you import your archive:

1. The file is read using the browser's File API
2. Data is processed entirely in your browser memory
3. Nothing is sent to any server
4. When you close the tab, data is cleared

AI insights use local heuristics—no external API calls.

## License

MIT
