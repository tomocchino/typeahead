# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React typeahead component library that implements a high-performance prefix-matching search interface. The project follows strict UI principles:
- **One reflow per keystroke**: Layout changes only once after each keystroke
- **No result reordering**: Results maintain their initial order throughout the session
- **Reverse waterfall filtering**: Matching results flow upwards as typing continues
- **Instant backspace**: Cached results appear immediately when backspacing

## Architecture

**Monorepo Structure**:
- `packages/typeahead/`: Core typeahead library (`@tomocchino/typeahead`)
- `packages/config/`: Shared ESLint and TypeScript configurations
- `apps/examples/`: Next.js demo application with various typeahead implementations
- Uses pnpm workspaces with Turbo for build orchestration

**Core Components**:
- `DataSource`: Token-based search engine with character-code bucketing for performance
- `DataSourceEntry`: Represents searchable items with text, value, tokens, and keywords
- `Typeahead`: React component handling keyboard navigation, selection, and rendering

**Key Architecture Details**:
- Token parsing splits text into searchable fragments
- Entries are bucketed by first character code for O(1) lookup
- Results are cached to enable instant backspace functionality
- Supports custom renderers and async data loading via queryHandler
- Complex entry insertion algorithm maintains order by token count and preserves initial sort order within buckets

## Commands

**Development**:
```bash
pnpm dev              # Start all development servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
```

**Testing**:
```bash
# Run tests in watch mode (examples app)
cd apps/examples && pnpm test

# Run a single test file
cd packages/typeahead && npx jest src/main/DataSource.test.ts
cd packages/typeahead && npx jest src/util/parseTokens.test.ts
```

**Type checking**:
```bash
cd apps/examples && pnpm check-types  # TypeScript type checking
```

## Development Notes

- Uses React 19 and Next.js 16 with Turbopack
- TypeScript configuration supports modern React features
- Jest testing framework with Babel transpilation
- Examples include movies (TMDB API), actors, cities, states, emoji, and strings
- Styling uses Tailwind CSS v3 with Radix UI components
- Performance-critical: filter hundreds of thousands of entries in <16ms

## Package Dependencies

The typeahead package only depends on React/React-DOM. Examples app adds Next.js, Tailwind, Radix UI, and various data sources (emojibase, etc.).