/**
 * useLocalStorage — persists state to localStorage with JSON serialization.
 *
 * @example
 * const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar_open', true)
 */

import { useState, useCallback } from 'react'
import { STORAGE_KEYS } from '@/config/constants'

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS] | string

export function useLocalStorage<T>(
  key: StorageKey,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        console.error('[useLocalStorage] Failed to write:', key, err)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
