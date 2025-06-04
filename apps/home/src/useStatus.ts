import { useMemo, useState } from 'react'

export function useStatus() {
  const [message, setMessage] = useState<string>()
  return useMemo(() => ({
    clear: () => setMessage(undefined),
    error: (message: string, cause: unknown) => {
      console.error(message, cause)
      if (cause instanceof Error) {
        message += ': ' + cause.message
      }
      setMessage(message)
    },
    info: (message: string) => setMessage(message),
    message,
  }), [message])
}
