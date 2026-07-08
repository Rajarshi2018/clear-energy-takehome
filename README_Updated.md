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

``` text
clear-energy-takehome/
├── apps/
│   ├── customer/
│   ├── driver/
│   └── admin-mobile/
├── packages/
│   └── shared/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── mock-api.json
└── README.md
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

## Fetch Wrapper

A shared Fetch-based API client avoids introducing additional
dependencies while centralizing request handling, error handling, abort
support, and future idempotency support.

## Custom useAsyncResource Hook

A lightweight custom hook keeps loading, error, empty, and success
handling identical across all three applications. React Query would
become more valuable once caching, mutations, or polling are introduced.

## Shared OrderCard

A single reusable component supports Customer, Driver, and Admin
variants using discriminated TypeScript props instead of maintaining
three separate implementations.

------------------------------------------------------------------------

# Trade-offs

The assignment prioritised architecture over feature count.

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

Replace this section with your actual time before submitting.

Example:

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
