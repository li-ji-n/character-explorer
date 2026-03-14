# Character Explorer

A production-quality React Native (Expo) app that lets you browse, search, and wishlist characters from the [Rick and Morty API](https://rickandmortyapi.com/graphql).

---

## Features

- **Infinite scroll** character list with 2-column grid layout
- **Server-side search** with 500 ms debounce
- **Status filters** — All / Alive / Dead / Unknown
- **Character detail screen** — hero image, status, species, gender, origin, location, and episode list
- **Persistent wishlist** — toggle favourite characters; state survives app restarts
- **Skeleton loaders** on initial load and hero image for smooth perceived performance
- **Typed GraphQL** — queries generated via GraphQL Code Generator

---

## How to Run

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Bun | latest |
| Expo CLI | bundled via `expo-dev-client` |
| Xcode (iOS) | ≥ 15 |
| Android Studio (Android) | latest |

### 1. Install dependencies

```bash
bun install
```

### 2. Run on iOS simulator

```bash
bun run ios
# or: npx expo run:ios
```

### 3. Run on Android emulator

```bash
bun run android
# or: npx expo run:android
```

### 4. Start the Metro bundler only

```bash
bun run start
```

> **Note:** This project uses a **custom dev client** (`expo-dev-client`), not Expo Go. You must build the native app at least once with `expo run:ios` or `expo run:android` before launching Metro.

### Regenerate GraphQL types (optional)

```bash
bun run codegen
```

---

## Project Structure

```
src/
├── api/
│   ├── client.ts        # QueryClient + typed gqlFetcher
│   └── queries.ts       # GraphQL query definitions
├── components/
│   └── CharacterCard.tsx  # Card + skeleton component
├── hooks/
│   └── useCharacters.ts   # Infinite query hook
├── navigation/            # Stack navigator setup
├── screens/
│   ├── HomeScreen.tsx     # List, search, filters
│   └── DetailScreen.tsx   # Character detail + wishlist toggle
├── store/
│   └── wishlistStore.ts   # Zustand + AsyncStorage persistence
├── gql/                   # Auto-generated GraphQL types
└── types/                 # Shared TypeScript types
```

---

## Design Decisions & Trade-offs

### GraphQL over REST
The Rick and Morty API exposes both REST and GraphQL endpoints. GraphQL was chosen so that each screen fetches **exactly the fields it needs** — no over-fetching. The list query requests only `id`, `name`, `image`, `status`, and `species`; the detail query additionally fetches `origin`, `location`, and `episode`.

### TanStack Query for server state
[TanStack Query](https://tanstack.com/query) handles all remote data: caching, background refetches, pagination, and error/loading states. This keeps components free of raw `useEffect`/`fetch` boilerplate and provides a 5-minute stale time and 10-minute garbage-collection window out of the box.

### Zustand + AsyncStorage for wishlist
The wishlist is the only **client state** that needs to persist. Zustand with its `persist` middleware backed by AsyncStorage is lightweight and requires almost no boilerplate compared to Redux. The store exposes a `toggle` action and an `isWishlisted` selector — no selectors library needed at this scale.

### Debounced search (client-side timer)
Search is debounced with a plain `useEffect` + `setTimeout` (500 ms) rather than a third-party hook. Changing the debounced value resets the infinite query automatically via the `queryKey`, so no extra logic is needed to clear previous results.

### FlatList performance props
`numColumns={2}`, `removeClippedSubviews`, `maxToRenderPerBatch={10}`, `initialNumToRender={6}`, and `windowSize={5}` are set explicitly to keep the list smooth on lower-end Android devices.

### expo-image instead of Image
`expo-image` provides built-in **memory-disk caching**, blurhash support, and significantly faster decode on both platforms compared to React Native's bundled `<Image>`.

### GraphQL Code Generator
`graphql-codegen` generates fully-typed `TypedDocumentNode` objects from `.graphql` files. This eliminates `any` casts on query results and catches mismatches between queries and the API schema at build time.

### Trade-off — no Apollo Client
Apollo Client would add normalised caching (useful when the same character appears in list and detail) but at the cost of a heavier bundle and more complex setup. At this scale, TanStack Query's query-key-based invalidation is sufficient.

---

## What I'd Improve with More Time

1. **Normalised cache** — Integrate Apollo Client or a custom TanStack Query `select` normaliser so that detail data fetched whilst browsing does not need a separate network round-trip when navigating to `DetailScreen`.

2. **Offline support** — Persist the last-loaded page of characters to AsyncStorage so the list is still visible without a network connection.

3. **Design system** — Extract colours, spacing, and typography into a shared `theme.ts` file instead of inline `StyleSheet` constants scattered across screens.

4. **Unit & integration tests** — Add Jest + React Native Testing Library tests for `useCharacters`, `wishlistStore`, and the key UI interactions (search clear, wishlist toggle, pagination).

5. **E2E tests** — Add Maestro or Detox flows for the full browse → detail → wishlist scenario.

6. **Accessibility** — Audit with `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` props on all interactive elements; verify with VoiceOver / TalkBack.

7. **Error retry UX** — Replace the plain error text with a "Retry" button that calls `refetch()` / `fetchNextPage()`.

8. **Pull-to-refresh** — Add `onRefresh` / `refreshing` props to the `FlatList` to invalidate the query and reload from page 1.

9. **CI/CD pipeline** — Set up GitHub Actions to run type-check (`tsc --noEmit`), lint, and tests on every PR, and EAS Build for distribution.


