"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing with loading state
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Object with debounced value and isDebouncing state
 */
export function useDebounceWithLoading<T>(
  value: T,
  delay: number = 300,
): {
  debouncedValue: T;
  isDebouncing: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    // If value hasn't changed from debounced, don't show loading
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }

    // Start debouncing
    setIsDebouncing(true);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}
