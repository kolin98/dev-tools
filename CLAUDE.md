# Project Overview

This is a **pnpm monorepo** for developer tools web app, using **pnpm workspaces** with a focus on modern web development using React, TypeScript, TanStack Router, Tailwind CSS v4, and shadcn/ui components.

## Monorepo Structure

```
dev-tools/
├── apps/
│   └── web/          # Main React web application (Vite + React)
├── packages/
│   └── core/         # Shared core utilities package
├── pnpm-workspace.yaml  # Workspace configuration
├── package.json      # Root package.json with workspace scripts
└── tsconfig.base.json  # Shared TypeScript configuration
```

### Workspace Configuration

The monorepo is configured via `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

This means:
- All packages in `apps/` directory are workspace members
- All packages in `packages/` directory are workspace members

### Workspace Members

#### apps/web
- **Framework**: Vite + React 19
- **Routing**: TanStack Router v1.x (file-based routing)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Language**: TypeScript
- **Dependencies**: Uses workspace `core` package (`"core": "workspace:*"`)

#### packages/core
- **Purpose**: Shared utilities and helper functions
- **Content**: Currently includes various ID generation libraries (cuid2, nanoid, ulid, uuid, xid-ts)

## UI Framework: Tailwind + shadcn/ui

### Tailwind CSS v4

The project uses **Tailwind CSS v4** with the new Vite-based setup:
- Import via `@import "tailwindcss"` in CSS
- Uses `@tailwindcss/vite` plugin
- Theme configuration through CSS variables

### shadcn/ui Components

- **Style**: New York style
- **Base Color**: Neutral
- **CSS Variables**: Enabled for theming
- **Icon Library**: Phosphor Icons (@phosphor-icons/react)
- **Path Aliases**:
  - `@/components` → `apps/web/src/components`
  - `@/lib/utils` → `apps/web/src/lib/utils`
  - `@/components/ui` → `apps/web/src/components/ui`
  - `@/lib` → `apps/web/src/lib`
  - `@/hooks` → `apps/web/src/hooks`

### Theming System

The project uses a comprehensive theming system with CSS custom properties:
- Light and dark mode support (via `.dark` class)
- OKLCH color space for better color control
- Custom shadow system
- Custom radius variables
- Sidebar-specific color tokens

### Typography

Google Fonts are loaded in `apps/web/index.html`:
- **Fira Code** (weights: 300, 400, 500, 600, 700) - Default sans-serif and mono font
- **Roboto** (weights: 300, 400, 500, 700) - Secondary serif font

Font usage with Tailwind classes:
- `font-sans` - Fira Code (default)
- `font-serif` - Roboto (secondary)
- `font-mono` - Fira Code

### Icons

Phosphor Icons are used throughout the application. Import and use icons in your components:

```tsx
import { House, User, Settings, ChartBar } from "@phosphor-icons/react"

// Basic usage
<House size={24} weight="regular" />

// With styling
<User size={32} weight="bold" color="currentColor" className="text-primary" />

// Available weights: thin, light, regular, bold, fill, duotone
<Settings size={20} weight="fill" />
```

When adding new shadcn/ui components, they will automatically use Phosphor icons.

## Routing: TanStack Router

The app uses **TanStack Router v1.x** with file-based routing for type-safe navigation and data loading.

### Router Configuration

- **Router Instance**: `apps/web/src/router.tsx` - Main router configuration
- **Route Tree**: Auto-generated at `apps/web/src/routeTree.gen.ts` by Vite plugin
- **Entry Point**: `apps/web/src/main.tsx` - Uses `<RouterProvider />` to render routes

### Route Structure

Routes are defined in `apps/web/src/routes/` using file-based conventions:

```
routes/
├── __root.tsx          # Root layout (wraps all routes)
├── index.tsx           # Home page (/)
├── about.tsx           # About page (/about)
├── users/
│   ├── index.tsx       # Users list (/users)
│   └── $userId.tsx     # User detail (/users/:userId)
└── blog_.$slug.tsx     # Blog post (/blog/:slug)
```

### File-Based Routing Conventions

| File Pattern | Route Path | Description |
|--------------|------------|-------------|
| `index.tsx` | `/` | Root/home page |
| `about.tsx` | `/about` | Simple route |
| `users/index.tsx` | `/users` | Nested index |
| `users/$userId.tsx` | `/users/:userId` | Dynamic parameter |
| `$slug.edit.tsx` | `/:slug/edit` | Dynamic + extension |
| `blog_.$slug.tsx` | `/blog/:slug` | Catchall with extension |

### Creating Routes

**Simple Route** (`routes/about.tsx`):
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About Page</div>
}
```

**Dynamic Route** (`routes/users/$userId.tsx`):
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  component: UserDetail,
})

function UserDetail() {
  const { userId } = Route.useParams()
  return <div>User: {userId}</div>
}
```

**Route with Data Loading**:
```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const response = await fetch(`/api/posts/${params.postId}`)
    return response.json()
  },
  component: PostDetail,
})

function PostDetail() {
  const post = Route.useLoaderData()
  return <div>{post.title}</div>
}
```

### Navigation

**Link Component** (with active state):
```tsx
import { Link } from '@tanstack/react-router'

<Link to="/" className="[&.active]:font-bold">
  Home
</Link>

<Link to="/users/$userId" params={{ userId: '123' }}>
  User Profile
</Link>
```

**Programmatic Navigation**:
```tsx
import { useRouter } from '@tanstack/react-router'

function MyComponent() {
  const router = useRouter()

  const handleClick = () => {
    router.navigate({
      to: '/users/$userId',
      params: { userId: '123' },
    })
  }

  return <button onClick={handleClick}>Go to User</button>
}
```

### Root Layout

The root layout (`routes/__root.tsx`) wraps all routes with:
- Navigation header
- `<Outlet />` for rendering child routes
- DevTools panel (development only)

Modify this file to add persistent UI elements (navbars, sidebars, footers).

## pnpm Commands in Monorepo

### Running Commands in Specific Packages

Use `pnpm --filter <package-name>` to run commands in a specific workspace package:

```bash
# Run dev server for web app
pnpm --filter web dev

# Build web app
pnpm --filter web build

# Lint web app
pnpm --filter web lint
```

### Root Scripts

The root `package.json` includes convenient shortcuts:

```bash
# Equivalent to: pnpm --filter web dev
pnpm dev:web

# Equivalent to: pnpm --filter web build
pnpm build:web
```

### Installing Dependencies

```bash
# Install dependency for specific package
pnpm --filter <package-name> add <dependency>

# Install dev dependency for specific package
pnpm --filter <package-name> add -D <dependency>

# Install dependency for all packages
pnpm add -w <dependency>
```

## Adding shadcn/ui Components

When working with shadcn/ui in a monorepo, you must use `pnpm dlx` and target the specific app:

### Basic Usage

```bash
# Add a component to the web app
pnpm --filter web dlx shadcn@latest add <component-name>

# Examples:
pnpm --filter web dlx shadcn@latest add button
pnpm --filter web dlx shadcn@latest add card
pnpm --filter web dlx shadcn@latest add input
```

### Multiple Components

```bash
# Add multiple components at once
pnpm --filter web dlx shadcn@latest add button card input dialog
```

### Overwriting Components

```bash
# Overwrite an existing component
pnpm --filter web dlx shadcn@latest add button --overwrite
```

### Why pnpm dlx?

Using `pnpm dlx shadcn@latest add` instead of installing shadcn globally or as a dev dependency ensures:
- You always use the latest version of the shadcn CLI
- No need to manage global npm packages
- The command runs in the context of your workspace package
- Clean execution without polluting your project's dependencies

## Development Workflow

### Starting Development

```bash
# Start the web app dev server
pnpm dev:web
# OR
pnpm --filter web dev
```

### Building

```bash
# Build the web app
pnpm build:web
# OR
pnpm --filter web build
```

### Type Checking

The project uses TypeScript with project references:
- `tsconfig.base.json` - Shared configuration
- Each package has its own `tsconfig.json` extending the base

## Adding New Workspace Packages

### Adding a New App

```bash
# Create the app directory
mkdir apps/new-app

# Initialize with your preferred tool (e.g., Vite)
cd apps/new-app
pnpm init

# In the new app's package.json, add workspace dependencies
# "core": "workspace:*"
```

### Adding a New Package

```bash
# Create the package directory
mkdir packages/new-package

# Create package.json with proper exports
{
  "name": "new-package",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

## Key Conventions

1. **Always use `pnpm --filter`** when running commands for specific packages
2. **Use `pnpm dlx shadcn@latest add`** for adding shadcn components to apps
3. **Workspace dependencies** use `"workspace:*"` version syntax
4. **TypeScript paths** are configured per-package for clean imports
5. **CSS variables** are used for theming - modify `apps/web/src/index.css` for theme changes
6. **Routes are file-based** - create routes in `apps/web/src/routes/` directory, route tree auto-generates on dev server start

## Common Issues

### "Cannot find module" errors

After adding new packages:
```bash
# Reinstall dependencies to ensure proper linking
pnpm install
```

### shadcn component not found after adding

Make sure you ran the command with the correct filter:
```bash
pnpm --filter web dlx shadcn@latest add <component>
```

### TypeScript path resolution issues

Check that the `tsconfig.json` in your package properly extends `tsconfig.base.json` and includes correct path mappings.

### TanStack Router route tree not generating

If the route tree file (`routeTree.gen.ts`) is not generated or outdated:
1. Ensure `@tanstack/router-plugin` is installed
2. Check that `TanStackRouterVite()` is placed **before** `react()` in `vite.config.ts`
3. Restart the dev server after adding/removing routes
4. Delete `src/routeTree.gen.ts` and restart the server to regenerate
5. Verify `tsconfig.app.json` includes `"src/routeTree.gen.ts"` in the `include` array
