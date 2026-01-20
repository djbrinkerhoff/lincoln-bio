"use client"

import { useRef, useCallback, useState } from "react"

export function useDebouncedSave(
  saveFn: () => Promise<void>,
  delay = 800
) {
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)
  const [saving, setSaving] = useState(false)

  const save = useCallback(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setSaving(true)
      await saveFn()
      setSaving(false)
    }, delay)
  }, [saveFn, delay])

  return { save, saving }
}
