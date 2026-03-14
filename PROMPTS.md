# AI Prompts Used


## Custom Data-Fetching Hook

> I have a character list screen that needs infinite scrolling with search and status filtering.
> Create a custom `useCharacters` hook that wraps `useInfiniteQuery`, accepts a search string
> and a status filter, and returns paginated results. Each page should use the `page` field from
> the API response info to determine if there is a next page.

---

## Performance Review

> Review this React Native app for performance issues. Check for:
> - Unnecessary React re-renders — are `memo`, `useCallback`, `useMemo` applied where needed?
> - FlatList optimisation — `keyExtractor`, batch render settings, clipping
> - TanStack Query usage — stale time, avoiding duplicate queries, `enabled` guards
> - Zustand subscriptions — optimise selectors?
> - Memory leaks — `useEffect` subscriptions missing cleanup
> - Unnecessary network calls
> - Heavy components that could be split or lazy-loaded
> - Image caching and placeholder strategy

---

## 429 Rate-Limit Handling

> The GraphQL endpoint occasionally returns 429 Too Many Requests.
> How should I handle this with TanStack Query?
> I want more retries for 429 specifically, and smarter back-off delays.

---

## Image Retry on Error

> In `CharacterCard`, the character images sometimes fail to load due to 429 Too Many Requests.
> Add a retry mechanism that automatically retries loading the image up to 3 times,
> with an increasing delay between attempts. Show a fallback placeholder if all retries fail.

---


> I have a Zustand wishlist store. How can I make sure components only re-render
> when the specific character they display is toggled, not on every wishlist change?

---

## UI & Design

> With the given designs, create pages for listing characters and the detail screen.
> The design should include a status indicator, info rows, and an episode list. Keep it clean and modern.

---

## README

> Write a README covering how to run the project, the folder structure,

