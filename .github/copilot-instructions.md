# Code Typer - AI Agent Instructions

## Project Overview

Code typing practice application built with React + TypeScript + Vite. Users type code snippets from various languages/frameworks to improve coding speed. Features syntax highlighting, WPM tracking, and user authentication via Supabase.

## Architecture & State Management

### Zustand Stores (Global State)

Three separate stores manage distinct concerns:

- **`userStore.ts`**: Typing progress (WPM, text arrays, line/word tracking, timer settings). Uses `persist` middleware to save `startingTime` to localStorage.
- **`sidebarStore.ts`**: Code filtering options (language, style, framework, paradigm, problem type). Persists all selections to `localStorage` under `"sidebar-settings"`.
- **`authStore.ts`**: Modal state only (`modalOpen`, `toggleModal`). No persistence.

Always use Zustand hooks with selectors for performance: `useStore(state => state.specificValue)` rather than `useStore()`.

### Context Pattern

**`TimerProvider`** wraps the app to provide timer functionality via `useTimerContext()`. Uses `react-timer-hook` internally. Timer state is managed here to enable global access while separating timer logic from stores.

## Data Flow - Typing Logic

### Text Processing Pipeline

1. **Fetch**: `TypingSection.tsx` queries Supabase `code` table based on sidebar filters (language, style, framework, paradigm, problemType)
2. **Parse**: `setText()` in `userStore` splits text into:
   - `textArray`: 2D array `[line][word]`
   - `spacesArray`: Leading spaces per line for indentation
3. **Render**: Text divided into three states (typed/current/untyped lines) with smooth vertical scrolling via CSS transforms

### Typing State Tracking

- `lineNum` / `wordIndex`: Current position in `textArray`
- `userTyped`: Input field value (invisible input with `z-[-1]`)
- Word completion triggers on space/enter key with trim match: `userTyped.trim() === textArray[lineNum][wordIndex]`
- WPM calculation in `calculateWPM()`: counts characters (not words), divides by 5, normalizes to 60 seconds

### Key Refs Pattern

Heavy use of refs to avoid stale closures in event listeners:

```tsx
const lineNumRef = useRef(0);
const modalOpenRef = useRef(modalOpen);
useEffect(() => {
  lineNumRef.current = lineNum;
}, [lineNum]);
```

Always sync refs when state changes for keyboard event handlers.

## Supabase Integration

### Database Schema

**`code` table** stores code snippets with columns:

- `code_block` (string): The actual code text
- `style` (string): "Leetcode" | "App Code" | "Any"
- `language` (string): lowercase language name
- `leetcode_category` (string): problem type for Leetcode style
- `framework` / `paradigm` (string): for App Code style
- `numberID` (number): Random selection via 1-50 range

### Query Pattern

Always filter by `style`, `language`, and random `numberID`. Include category-specific filters (`leetcode_category` or `framework`+`paradigm`). Handle "Any" options by randomly selecting from filtered arrays before querying.

### Type Generation

Run: `npx supabase gen types --project-id xdbkvtcjyuiuqeitqtqr > src/supabase/database/types.ts`

### Environment Variables

Required in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Syntax Highlighting

Uses **Shiki** (not highlight.js despite dependency). Highlighter initialized asynchronously in `lib/highlighter.ts`:

```tsx
const highlighter = await createHighlighter({
  themes: ["dark-plus"],
  langs: ["jsx"],
});
```

Call `highlighter.codeToHtml(code, { lang, theme })` then parse with `html-react-parser`.

## Styling & Theme

### Custom Colors

VSCode-inspired theme defined in `tailwind.config.ts`:

```tsx
vscode: {
  background: "#1F1F1F",
  primary: "#181818",
  secondary: "#242424",
  outline1: "#2B2B2B",
  outline2: "#454545",
}
```

Use semantic classes: `bg-vscode-background`, `border-vscode-outline1`, `text-vscode-text-bright`.

### Typography

Custom fonts defined in `src/assets/fonts/fonts.css`:

- `font-vscodeTitle`: microsoft-sans-serif
- `font-vscodeText`: Menlo (code display)

## Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

Path alias: `@/` maps to `./src/` (configured in `vite.config.ts`).

## Common Patterns

### Dynamic Dropdowns

Sidebar uses cascading dropdowns where selection affects downstream options. Example: selecting Language resets Framework to "None" and Paradigm to "Any". See `Sidebar.tsx` for the `setCurrentOption` pattern.

### Keyboard Focus Management

Document-level keydown listener auto-focuses hidden input field. Prevents space/enter default behavior in `addEventListener("keydown")` to control word advancement manually.

### Modal Overlay

Login modal rendered conditionally in `App.tsx` with darkened overlay. Click overlay (`onClick={toggleModal}`) to dismiss. Modal content stops propagation.

## File Organization

- `src/pages/`: Route components (TypingPage, AccountPage, InfoPage)
- `src/components/my_own/`: Custom components (Sidebar, LoginModal, DropdownButton)
- `src/components/ui/`: shadcn/ui components (button, dropdown-menu)
- `src/store/`: Zustand stores
- `src/context/`: React context providers
- `api/`: Backend utilities (username generation, Supabase config)
