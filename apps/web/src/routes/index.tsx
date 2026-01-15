import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to TanStack Router</h1>
      <p className="mt-4 text-muted-foreground">
        This is the home page powered by TanStack Router v1.x
      </p>
    </div>
  )
}
