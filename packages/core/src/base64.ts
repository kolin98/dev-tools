export type EncodingType = 'utf-8' | 'ascii' | 'latin1'

/**
 * Encodes a string to Base64 with support for different text encodings
 * @param text The plain text to encode
 * @param encoding The text encoding to use (default: 'utf-8')
 * @returns Base64 encoded string
 */
export function encodeToBase64(text: string, encoding: EncodingType = 'utf-8'): string {
  if (!text) return ''

  try {
    if (encoding === 'utf-8') {
      // UTF-8 encoding (handles Unicode, emojis)
      const bytes = new TextEncoder().encode(text)
      const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
      return btoa(binary)
    } else if (encoding === 'ascii') {
      // ASCII only - standard btoa for ASCII text
      return btoa(text)
    } else if (encoding === 'latin1') {
      // Latin1/ISO-8859-1 encoding - uses escape for non-Latin1 chars
      const encoded = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
      })
      return btoa(encoded)
    }
  } catch (error) {
    console.error('Base64 encoding error:', error)
    return ''
  }

  return ''
}

/**
 * Decodes a Base64 string to plain text with support for different text encodings
 * @param base64 The Base64 encoded string
 * @param encoding The text encoding to use (default: 'utf-8')
 * @returns Decoded plain text, or empty string if invalid
 */
export function decodeFromBase64(base64: string, encoding: EncodingType = 'utf-8'): string {
  if (!base64) return ''

  try {
    const binary = atob(base64.trim())

    if (encoding === 'utf-8') {
      // UTF-8 decoding
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return new TextDecoder().decode(bytes)
    } else if (encoding === 'ascii') {
      // ASCII decoding - direct return
      return binary
    } else if (encoding === 'latin1') {
      // Latin1 decoding - reverse of encodeURIComponent escape
      const decoded = atob(base64.trim())
      return decodeURIComponent(
        decoded.split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
      )
    }
  } catch (error) {
    // Return empty string for invalid Base64 (graceful degradation)
    return ''
  }

  return ''
}

/**
 * Validates if a string is valid Base64
 * @param str The string to validate
 * @returns true if valid Base64, false otherwise
 */
export function isValidBase64(str: string): boolean {
  if (!str) return false

  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}
