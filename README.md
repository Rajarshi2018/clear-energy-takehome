# Clear Energy --- 3-App Take-Home

A monorepo containing three Expo (React Native) applications
(**Customer**, **Driver**, and **Admin Mobile**) that share one
TypeScript type layer, one API client, reusable hooks, and one
`OrderCard` component from `packages/shared`.

> **Project Goal:** Demonstrate a maintainable multi-app architecture
> with shared code, consistent UI, and reusable business logic instead
> of building three independent applications.

------------------------------------------------------------------------

# Tech Stack

-   React Native
-   Expo SDK 51
-   TypeScript
-   React Navigation
-   npm Workspaces
-   JSON Server
-   Fetch API
-   Shared Package Architecture

------------------------------------------------------------------------

# Setup

## 1. Install dependencies

``` bash
npm install
```

## 2. Start the mock backend

From the project root:

``` bash
npx json-server mock-api.json --port 4000
```

## 3. Run the Customer App

``` bash
cd apps/customer
npx expo start --web --offline --clear
```

## 4. Run the Driver App

``` bash
cd apps/driver
npx expo start --web --offline --clear
```

## 5. Run the Admin Mobile App

``` bash
cd apps/admin-mobile
npx expo start --web --offline --clear
```

All three applications connect to **http://localhost:4000**.

------------------------------------------------------------------------

# Repository Structure

```
clear-energy-takehome/
├── apps/
│   ├── customer/       Expo app — "Today's Orders"
│   ├── driver/          Expo app — "Today's Trip"
│   └── admin-mobile/    Expo app — "Pending Actions"
├── packages/
│   └── shared/
│       ├── types/        Order, TripStop, PendingAction — derived from openapi.yaml
│       ├── api/           client.ts (fetch wrapper) + endpoints.ts (3 typed calls)
│       ├── components/    OrderCard.tsx — one component, three variants
│       ├── hooks/         useAsyncResource.ts — shared loading/error/success/empty pattern
│       └── utils/         formatPricePaise.ts + its test
├── mock-api.json
└── package.json           npm workspaces root
```

------------------------------------------------------------------------

# Architecture

``` text
                 packages/shared
        +------------------------------+
        | TypeScript Types             |
        | API Client                   |
        | OrderCard                    |
        | useAsyncResource Hook        |
        +------------------------------+
              ↑         ↑         ↑
         Customer    Driver    Admin
```

------------------------------------------------------------------------

# Tech Choices

## npm Workspaces

Chosen instead of Turborepo/Nx because the project contains only three
small applications and one shared package. npm Workspaces provide a
lightweight monorepo without unnecessary tooling complexity.

## Expo

Expo was selected because the assignment does not require native
modules, making development and testing much faster.

## Fetch Wrapper, not axios

zero extra dependency for 3 read endpoints; the wrapper
already centralizes error typing (`ApiError` vs `NetworkError`), so swapping the internals
for axios later wouldn't change any call site.

## Custom useAsyncResource Hook, not React Query

for 3 read-only, non-cached, 
non-revalidated endpoints, a ~30-line hook keeps the 4-state pattern (loading / error /
empty / success) identical across all three screens without pulling in a caching library
whose main benefits (background refetch, cache invalidation, mutation handling) aren't
exercised by this task. I'd swap in React Query the moment we add polling, optimistic
writes, or shared cache across screens — noted under "what I'd add."

## Shared OrderCard

A single reusable component supports Customer, Driver, and Admin
variants using discriminated TypeScript props instead of maintaining
three separate implementations.

## Discriminated-union props on `<OrderCard />`** 
(`variant: 'customer' | 'driver' | 'admin'`)
instead of three components or one component with a dozen optional booleans. TypeScript
narrows the `data` shape per variant, so a driver-view can't accidentally receive an
`Order` at compile time.

## SectionList for Admin, grouped client-side by `category`** 
— the mockup shows category
headers (Cash / MI Empty / Unassigned); grouping happens once in the screen, not inside
the shared card.

------------------------------------------------------------------------

# Trade-offs

The assignment prioritised architecture over feature count.

- **React Query / TanStack Query** — see above; not needed for 3 static reads in this slice.
- **Design tokens package** — with 3 screens I inlined the brand colour (`#0F766E`) and a
  handful of status-colour maps directly in `OrderCard.tsx`. Real next step once a 4th
  screen lands.
- **Env-based API base URL** — hardcoded `http://localhost:4000` for the take-home; a real
  build would read this from `app.config.ts` per environment (dev/staging/prod).
- **Auth / hardcoded IDs** — out of scope per brief; `c-001` / `d-101` / `a-201` are
  hardcoded constants at the top of each screen.
- **Admin action buttons don't actually call an endpoint** — `onAction` is wired on
  `<OrderCard variant="admin" />` but the screen passes a no-op, since there are no write
  endpoints in this task. The idempotency-key pattern is already in `api/client.ts` for when
  they land.
- **Tests beyond the one required unit test** — per brief §10, not doing component/E2E tests.

Included:

-   Shared API client
-   Shared components
-   Shared hooks
-   Shared TypeScript models
-   Four UI states (Loading, Error, Empty, Success)

Not included:

-   React Query
-   Authentication
-   Offline support
-   Pagination
-   Search & filtering
-   Push notifications
-   Dark mode
-   E2E tests
-   Additional unit tests

These were intentionally omitted to stay focused on the assignment
objectives.

------------------------------------------------------------------------

# What I'd Add With More Time

1. Wire the Admin action buttons to real mutation endpoints once they exist, using the
   idempotency-key plumbing already in `api/client.ts`.
2. Swap `useAsyncResource` for React Query once there's more than one screen per app or a
   need for background refetch / polling (e.g. driver ETA updates).
3. Pull the colour/spacing constants out of `OrderCard.tsx` into a small
   `packages/shared/theme.ts` so a 4th screen (or a design refresh) touches one file.
4. A thin `packages/shared/api/env.ts` so each app can point at a different API base URL
   per build without editing `client.ts`.

-   React Query for caching and background refetching
-   Environment-based API configuration
-   Design token package
-   CI pipeline with linting and testing
-   Accessibility improvements
-   Pull-to-refresh and pagination
-   Additional unit and integration tests

------------------------------------------------------------------------

# AI Usage

ChatGPT was used as a development assistant for:

-   discussing project architecture
-   reviewing TypeScript patterns
-   improving reusable component structure
-   refining documentation
-   reviewing code quality

AI-generated suggestions were reviewed manually before being
incorporated. Final implementation decisions, debugging, testing, and
validation were completed manually.

------------------------------------------------------------------------

# Honest Hours
```
        Task                           Time
        --------------------- -------------
        Project setup                20 min
        Shared package               20 min
        Customer App                 15 min
        Driver App                   15 min
        Admin App                    15 min
        Testing & Debugging          30 min
        README                       15 min

        **Total:** \~2 -- 2.5 hours.
```
------------------------------------------------------------------------

# Known Gaps

-   API base URL is currently hardcoded to `localhost:4000`.
-   Authentication is intentionally omitted as requested in the
    assignment.
-   Admin action buttons are wired but do not perform mutations because
    no write endpoints were provided.
-   Driver stops are sorted client-side by sequence.
-   Only the required unit test was implemented to remain within the
    assignment scope.
