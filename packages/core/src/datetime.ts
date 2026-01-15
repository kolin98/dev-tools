export type DateFormat = 'auto' | 'date' | 'time' | 'iso8601' | 'iso9075' | 'rfc7231' | 'unix' | 'unix-ms' | 'excel'

export interface DateTimeFormat {
  key: DateFormat
  label: string
}

export const DATE_FORMATS: DateTimeFormat[] = [
  { key: 'auto', label: 'Auto-detect' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'iso8601', label: 'ISO 8601' },
  { key: 'iso9075', label: 'ISO 9075 (SQL)' },
  { key: 'rfc7231', label: 'RFC 7231 (HTTP)' },
  { key: 'unix', label: 'Unix Timestamp (s)' },
  { key: 'unix-ms', label: 'Unix Timestamp (ms)' },
  { key: 'excel', label: 'Excel Format' },
]

export function formatDate(date: Date, format: DateFormat): string {
  switch (format) {
    case 'date':
      return formatDateOnly(date)

    case 'time':
      return formatTimeOnly(date)

    case 'iso8601':
      return formatISO8601Local(date)

    case 'iso9075':
      return formatISO9075(date)

    case 'rfc7231':
      return date.toUTCString()

    case 'unix':
      return Math.floor(date.getTime() / 1000).toString()

    case 'unix-ms':
      return date.getTime().toString()

    case 'excel':
      return formatExcel(date)

    case 'auto':
      return formatDate(date, 'iso8601')

    default:
      return ''
  }
}

function formatISO8601Local(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

  const offset = -date.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(offset) / 60)
  const offsetMinutes = Math.abs(offset) % 60
  const offsetSign = offset >= 0 ? '+' : '-'
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatTimeOnly(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function formatISO9075(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function formatExcel(date: Date): string {
  const excelEpoch = new Date(1899, 11, 31)
  const daysSinceExcelEpoch = (date.getTime() - excelEpoch.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceExcelEpoch.toString()
}

export function parseDate(input: string, format: DateFormat): Date | null {
  if (!input || !input.trim()) {
    return null
  }

  try {
    switch (format) {
      case 'date':
        return parseDateOnly(input)

      case 'time':
        return parseTimeOnly(input)

      case 'iso8601':
        return parseISO8601(input)

      case 'iso9075':
        return parseISO9075(input)

      case 'rfc7231':
        return parseRFC7231(input)

      case 'unix':
        return parseUnix(input, false)

      case 'unix-ms':
        return parseUnix(input, true)

      case 'excel':
        return parseExcel(input)

      case 'auto':
        const detected = detectDateFormat(input)
        return detected ? parseDate(input, detected) : null

      default:
        return null
    }
  } catch {
    return null
  }
}

function parseISO8601(input: string): Date | null {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/
  if (!iso8601Regex.test(input)) return null

  const date = new Date(input)
  return isNaN(date.getTime()) ? null : date
}

function parseDateOnly(input: string): Date | null {
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = input.match(dateRegex)
  if (!match) return null

  const [, year, month, day] = match
  const now = new Date()
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  )

  return isNaN(date.getTime()) ? null : date
}

function parseTimeOnly(input: string): Date | null {
  const timeRegex = /^(\d{2}):(\d{2}):(\d{2})$/
  const match = input.match(timeRegex)
  if (!match) return null

  const [, hours, minutes, seconds] = match
  const now = new Date()
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  )

  return isNaN(date.getTime()) ? null : date
}

function parseISO9075(input: string): Date | null {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return null

  const [, year, month, day, hours, minutes, seconds] = match
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  )

  return isNaN(date.getTime()) ? null : date
}

function parseRFC7231(input: string): Date | null {
  const rfc7231Regex = /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/
  if (!rfc7231Regex.test(input)) return null

  const date = new Date(input)
  return isNaN(date.getTime()) ? null : date
}

function parseUnix(input: string, isMilliseconds: boolean): Date | null {
  const timestamp = parseInt(input, 10)
  if (isNaN(timestamp)) return null

  const time = isMilliseconds ? timestamp : timestamp * 1000
  const date = new Date(time)

  return isNaN(date.getTime()) ? null : date
}

function isExcelFormat(input: string): boolean {
  const value = parseFloat(input)
  if (isNaN(value)) return false

  return value > 0 && value < 100000
}

function parseExcel(input: string): Date | null {
  const days = parseFloat(input)
  if (isNaN(days)) return null

  const excelEpoch = new Date(1899, 11, 31)
  const time = excelEpoch.getTime() + days * (1000 * 60 * 60 * 24)
  const date = new Date(time)

  return isNaN(date.getTime()) ? null : date
}

export function detectDateFormat(input: string): DateFormat | null {
  if (!input || !input.trim()) {
    return null
  }

  if (isExcelFormat(input)) {
    if (parseDate(input, 'excel')) {
      return 'excel'
    }
  }

  const formatsToTry: DateFormat[] = ['date', 'time', 'iso8601', 'rfc7231', 'iso9075', 'unix-ms', 'unix']

  for (const format of formatsToTry) {
    if (parseDate(input, format)) {
      return format
    }
  }

  return null
}

export function formatAllDates(date: Date): Record<string, string> {
  const formats: Exclude<DateFormat, 'auto'>[] = ['date', 'time', 'iso8601', 'iso9075', 'rfc7231', 'unix', 'unix-ms', 'excel']
  const result: Record<string, string> = {}

  for (const format of formats) {
    result[format] = formatDate(date, format)
  }

  return result
}
