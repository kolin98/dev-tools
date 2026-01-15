import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { formatDate, parseDate, detectDateFormat, DATE_FORMATS, type DateFormat } from 'core'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyIcon, CheckIcon } from '@phosphor-icons/react'

const displayFormats = [
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'iso8601', label: 'ISO 8601' },
  { key: 'iso9075', label: 'ISO 9075 (SQL)' },
  { key: 'rfc7231', label: 'RFC 7231 (HTTP)' },
  { key: 'unix', label: 'Unix Timestamp (s)' },
  { key: 'unix-ms', label: 'Unix Timestamp (ms)' },
  { key: 'excel', label: 'Excel Format' },
]

export const Route = createFileRoute('/tools/converters/datetime')({
  component: DateTimeConverter,
})

function DateTimeConverter() {
  const [inputValue, setInputValue] = useState('')
  const [inputFormat, setInputFormat] = useState<DateFormat>('auto')
  const [isAutoUpdate, setIsAutoUpdate] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [parsedDate, setParsedDate] = useState<Date | null>(new Date())

  useEffect(() => {
    if (!isAutoUpdate) return

    const interval = setInterval(() => {
      const now = new Date()
      setParsedDate(now)
    }, 100)

    return () => clearInterval(interval)
  }, [isAutoUpdate])

  const handleChange = (value: string) => {
    setInputValue(value)
    setIsAutoUpdate(false)

    if (!value || !value.trim()) {
      setParsedDate(null)
      setInputFormat('auto')
      return
    }

    const formatToTry = inputFormat === 'auto' ? 'auto' : inputFormat
    const date = parseDate(value, formatToTry)
    setParsedDate(date)

    if (!date) {
      setInputFormat('auto')
      return
    }

    if (inputFormat === 'auto' && date) {
      const detected = detectDateFormat(value)
      if (detected) {
        setInputFormat(detected)
      }
    }
  }

  const handleFormatChange = (value: DateFormat) => {
    setInputFormat(value)
    setIsAutoUpdate(false)

    if (inputValue) {
      const date = parseDate(inputValue, value)
      setParsedDate(date)
    }
  }

  const handleClear = () => {
    setInputValue('')
    setInputFormat('auto')
    setIsAutoUpdate(true)
  }

  const handleCopy = async (text: string, index: number) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const displayValues = parsedDate ? displayFormats.map((format) => ({
    ...format,
    value: formatDate(parsedDate, format.key as DateFormat),
  })) : displayFormats.map((format) => ({
    ...format,
    value: '',
  }))

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Date-time Converter</h1>
        <p className="text-muted-foreground">
          Convert between various date and time formats
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            {isAutoUpdate
              ? 'Showing current date/time (auto-updating)'
              : 'User provided date/time value'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="datetime-input">Date/Time Value</Label>
              <Input
                id="datetime-input"
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Paste or type date/time..."
                className={
                  parsedDate === null && !isAutoUpdate && inputValue
                    ? 'border-red-500'
                    : ''
                }
              />
            </div>
            <div className="w-48 space-y-2">
              <Label htmlFor="format-select">Format</Label>
              <Select value={inputFormat} onValueChange={(value) => handleFormatChange(value as DateFormat)}>
                <SelectTrigger id="format-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((format) => (
                    <SelectItem key={format.key} value={format.key}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleClear} variant="outline">
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Converted Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Format</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayValues.map((item, index) => (
                  <TableRow key={item.key}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.value || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(item.value, index)}
                        disabled={!item.value}
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
