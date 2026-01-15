import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Engine, Key, Binary, Blueprint, Swap, Clock } from '@phosphor-icons/react'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

const toolGroups = [
  {
    name: 'Generators',
    icon: Engine,
    tools: [
      {
        title: 'Identifiers',
        description: 'Generate unique identifiers like UUID, ULID, NanoID, and more',
        icon: Key,
        path: '/tools/generators/identifiers',
      },
    ],
  },
  {
    name: 'Encoders / Decoders',
    icon: Binary,
    tools: [
      {
        title: 'Base64',
        description: 'Encode and decode Base64 text with support for multiple encodings',
        icon: Blueprint,
        path: '/tools/encoders/base64',
      },
    ],
  },
  {
    name: 'Converters',
    icon: Swap,
    tools: [
      {
        title: 'Date-time',
        description: 'Convert between various date and time formats',
        icon: Clock,
        path: '/tools/converters/datetime',
      },
    ],
  },
]

function IndexComponent() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
        <p className="text-muted-foreground">
          A collection of useful tools for developers
        </p>
      </div>

      {toolGroups.map((group) => (
        <div key={group.name} className="space-y-4">
          <div className="flex items-center gap-2">
            <group.icon size={24} weight="bold" className="text-primary" />
            <h2 className="text-2xl font-semibold">{group.name}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.tools.map((tool) => (
              <Link key={tool.path} to={tool.path}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <tool.icon size={24} weight="regular" className="text-primary" />
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
