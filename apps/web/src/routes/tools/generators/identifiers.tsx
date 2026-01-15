import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { generateIdentifiers, type IdentifierType } from 'core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyIcon, PlusIcon, MinusIcon, CheckIcon } from '@phosphor-icons/react'

const identifierTypes: { value: IdentifierType; label: string }[] = [
  { value: 'uuid4', label: 'UUID v4' },
  { value: 'uuid1', label: 'UUID v1' },
  { value: 'nanoid', label: 'NanoID' },
  { value: 'xid', label: 'XID' },
  { value: 'cuid2', label: 'CUID2' },
  { value: 'ulid', label: 'ULID' },
]

export const Route = createFileRoute('/tools/generators/identifiers')({
  component: IdentifierGenerator,
})

function IdentifierGenerator() {
  const [type, setType] = useState<IdentifierType>('uuid4')
  const [quantity, setQuantity] = useState(5)
  const [results, setResults] = useState<string[]>(() => generateIdentifiers('uuid4', 5))
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = () => {
    const newResults = generateIdentifiers(type, quantity)
    setResults(newResults)
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(results.join('\n'))
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy all:', err)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(100, quantity + delta))
    setQuantity(newQuantity)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Identifier Generator</h1>
        <p className="text-muted-foreground">
          Generate unique identifiers using various algorithms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Choose the type and quantity of identifiers to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="type">Identifier Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as IdentifierType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {identifierTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <MinusIcon size={16} />
                </Button>
                <div className="w-16 text-center font-mono text-sm">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 100}
                >
                  <PlusIcon size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full md:w-auto">
            Generate
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                {results.length} identifier{results.length !== 1 ? 's' : ''} generated
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              {copiedIndex === -1 ? (
                <>
                  <CheckIcon size={16} className="mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon size={16} className="mr-2" />
                  Copy All
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {result}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(result, index)}
                      >
                        {copiedIndex === index ? (
                          <CheckIcon size={18} className="text-green-500" />
                        ) : (
                          <CopyIcon size={18} />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
