"use client";

// Sound effect URLs - using base64 encoded short sounds for instant loading
const SOUNDS = {
  // Short "pop" sound for adding to cart
  addToCart:
    "data:audio/wav;base64,UklGRl4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToDAAB/f39/f39/f39/f39/f39/f39/f4GDhYeJi42PkZOVl5mbnaGjpaeprK6wsrS2uLq8vr/BwsPExcbHyMnKysvMzM3Nzs7Ozs7Ozs7Nzc3MzMvKycjHxsXEw8LBwL++vLq4trSysa+tq6mnpaOhoJ6cmpiWlJKQjo2LiYeGhIOCgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUBAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAP//AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==",

  // Short "ding" sound for success/checkout
  success:
    "data:audio/wav;base64,UklGRoQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWAEAACAf39/f39/gICAf39/f4B/gH+Af4B/gH+AgICAgICAgYGBgYKCgoKDg4ODhISEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///wAA//7+/v39/fz8/Pv7+/r6+vn5+fj4+Pf39/b29vX19fT09PPz8/Ly8vHx8fDw8O/v7+7u7u3t7ezs7Ovr6+rq6unp6ejo6Ofn5+bm5uXl5eTk5OPj4+Li4uHh4eDg4N/f397e3t3d3dzc3Nvb29ra2tnZ2djY2NfX19bW1tXV1dTU1NPT09LS0tHR0dDQ0M/Pz87Ozs3Nzc==",

  // Short "click" for buttons
  click:
    "data:audio/wav;base64,UklGRiwBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQgBAAB/gH+AfoB9gHyAe4B6gHmAeIB4gHmAeoB7gHyAfYB+gH+AgICBgIKAg4CEgIWAhoCHgIiAiYCKgIuAjICNgI6Aj4CQgJGAkoCTgJSAlYCWgJeAmICZgJqAm4CcgJ2AnoCfgKCAoYCigKOApIClgKaAp4CogKmAqoCrgKyArYCugK+AsICxgLKAs4C0gLWAtoC3gLiAuYC6gLuAvIC9gL6Av4DAgMGAwoDDgMSAxYDGgMeAyIDJgMqAy4DMgM2AzoDPgNCA0YDSgNOA1IDVgNaA14DYgNmA2oDbgNyA3YDegN+A4IDhgOKA44DkgOWA5oDngOiA6YDqgOuA7IDtgO6A74DwgPE=",
};

// Keep track of audio context for better performance
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  return audioContext;
}

// Vibration patterns
const VIBRATION_PATTERNS = {
  short: [50],
  medium: [100],
  success: [50, 30, 100],
  double: [50, 50, 50],
};

/**
 * Play a sound effect
 */
export function playSound(
  type: keyof typeof SOUNDS,
  volume: number = 0.5,
): void {
  // Check if sounds are enabled (could use localStorage setting)
  const soundEnabled =
    typeof window !== "undefined"
      ? localStorage.getItem("pos-sounds") !== "disabled"
      : true;

  if (!soundEnabled) return;

  try {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(() => {
      // Ignore autoplay errors - user interaction required
    });
  } catch (error) {
    console.warn("Sound playback failed:", error);
  }
}

/**
 * Trigger haptic feedback (vibration)
 */
export function hapticFeedback(
  type: keyof typeof VIBRATION_PATTERNS = "short",
): void {
  // Check if haptics are enabled
  const hapticsEnabled =
    typeof window !== "undefined"
      ? localStorage.getItem("pos-haptics") !== "disabled"
      : true;

  if (!hapticsEnabled) return;

  // Check if vibration API is available
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(VIBRATION_PATTERNS[type]);
    } catch (error) {
      // Vibration not supported or failed
    }
  }
}

/**
 * Combined feedback - plays sound and haptic
 */
export function feedback(
  sound: keyof typeof SOUNDS,
  haptic: keyof typeof VIBRATION_PATTERNS = "short",
  volume: number = 0.5,
): void {
  playSound(sound, volume);
  hapticFeedback(haptic);
}

/**
 * Specific feedback functions for common actions
 */
export const soundEffects = {
  addToCart: () => feedback("addToCart", "short", 0.4),
  checkout: () => feedback("success", "success", 0.5),
  click: () => feedback("click", "short", 0.3),
  success: () => feedback("success", "medium", 0.5),
};

/**
 * Toggle sounds on/off
 */
export function toggleSounds(enabled: boolean): void {
  if (typeof window !== "undefined") {
    if (enabled) {
      localStorage.removeItem("pos-sounds");
    } else {
      localStorage.setItem("pos-sounds", "disabled");
    }
  }
}

/**
 * Toggle haptics on/off
 */
export function toggleHaptics(enabled: boolean): void {
  if (typeof window !== "undefined") {
    if (enabled) {
      localStorage.removeItem("pos-haptics");
    } else {
      localStorage.setItem("pos-haptics", "disabled");
    }
  }
}

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("pos-sounds") !== "disabled";
}

/**
 * Check if haptics are enabled
 */
export function isHapticsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("pos-haptics") !== "disabled";
}
