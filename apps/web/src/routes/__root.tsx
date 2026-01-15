import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  )
}
