import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { encodeToBase64, decodeFromBase64, type EncodingType } from 'core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tools/encoders/base64')({
  component: Base64Tool,
})

const encodingOptions: { value: EncodingType; label: string }[] = [
  { value: 'utf-8', label: 'UTF-8' },
  { value: 'ascii', label: 'ASCII' },
]

function Base64Tool() {
  const [textContent, setTextContent] = useState('')
  const [base64Content, setBase64Content] = useState('')
  const [encoding, setEncoding] = useState<EncodingType>('utf-8')
  const [copiedSide, setCopiedSide] = useState<'text' | 'base64' | null>(null)
  const updateSourceRef = useRef<'text' | 'base64' | 'encoding' | null>(null)

  // Re-encode when encoding changes
  useEffect(() => {
    if (updateSourceRef.current === 'encoding') {
      updateSourceRef.current = null
      return
    }
    // Re-encode text content with new encoding
    const encoded = encodeToBase64(textContent, encoding)
    setBase64Content(encoded)
  }, [encoding, textContent])

  // Handle text input changes
  useEffect(() => {
    if (updateSourceRef.current === 'base64' || updateSourceRef.current === 'encoding') {
      updateSourceRef.current = null
      return
    }
    const encoded = encodeToBase64(textContent, encoding)
    setBase64Content(encoded)
  }, [textContent, encoding])

  // Handle Base64 input changes
  useEffect(() => {
    if (updateSourceRef.current === 'text' || updateSourceRef.current === 'encoding') {
      updateSourceRef.current = null
      return
    }
    const decoded = decodeFromBase64(base64Content, encoding)
    setTextContent(decoded)
  }, [base64Content, encoding])

  const handleTextChange = (value: string) => {
    updateSourceRef.current = 'text'
    setTextContent(value)
  }

  const handleBase64Change = (value: string) => {
    updateSourceRef.current = 'base64'
    setBase64Content(value)
  }

  const handleEncodingChange = (newEncoding: EncodingType) => {
    updateSourceRef.current = 'encoding'
    setEncoding(newEncoding)
  }

  const handleCopy = async (text: string, side: 'text' | 'base64') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSide(side)
      setTimeout(() => setCopiedSide(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    updateSourceRef.current = 'text'
    setTextContent('')
    setBase64Content('')
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Convert text to Base64 and back with support for multiple character encodings
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Converter</CardTitle>
              <CardDescription>Type in either box to automatically convert</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Encoding Selector */}
          <div className="w-full sm:w-auto space-y-2">
            <Label htmlFor="encoding">Text Encoding</Label>
            <Select value={encoding} onValueChange={(value) => handleEncodingChange(value as EncodingType)}>
              <SelectTrigger id="encoding" className="w-full sm:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {encodingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Two textareas side by side */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Text Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-input">Text</Label>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(textContent, 'text')} disabled={!textContent}>
                  {copiedSide === 'text' ? (
                    <><Check size={16} className="mr-2 text-green-500" />Copied!</>
                  ) : (
                    <><Copy size={16} className="mr-2" />Copy</>
                  )}
                </Button>
              </div>
              <textarea
                id="text-input"
                value={textContent}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter plain text here..."
                className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y font-mono"
              />
            </div>

            {/* Base64 Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="base64-input">Base64</Label>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(base64Content, 'base64')} disabled={!base64Content}>
                  {copiedSide === 'base64' ? (
                    <><Check size={16} className="mr-2 text-green-500" />Copied!</>
                  ) : (
                    <><Copy size={16} className="mr-2" />Copy</>
                  )}
                </Button>
              </div>
              <textarea
                id="base64-input"
                value={base64Content}
                onChange={(e) => handleBase64Change(e.target.value)}
                placeholder="Enter Base64 encoded text here..."
                className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
