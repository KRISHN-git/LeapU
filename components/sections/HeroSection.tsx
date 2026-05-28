'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHandGesture } from '@/hooks/useHandGesture'
import { useThemeContext } from '@/components/layout/ThemeProvider'
import type { GestureType } from '@/types/gesture'

const SECTIONS = ['#projects', '#vision', '#voice', '#terminal']

const GESTURE_LABELS: Record<NonNullable<GestureType>, string> = {
  wave:          '👋 Hello! Welcome to the lab',
  'swipe-left':  '→ Next section',
  'swipe-right': '← Previous section',
  palm:          '☀️ Theme toggled',
}

const GESTURE_HINTS = [
  { icon: '👋', label: 'wave to say hello' },
  { icon: '✋', label: 'open palm — toggle theme' },
  { icon: '👈', label: 'swipe to navigate' },
]

export function HeroSection() {
  const { toggleTheme } = useThemeContext()
  const [enabled, setEnabled] = useState(false)
  const [gestureLabel, setGestureLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const sectionIndexRef = useRef(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (label: string) => {
  setGestureLabel(label)
  if (toastTimer.current !== null) clearTimeout(toastTimer.current)
  toastTimer.current = setTimeout(() => setGestureLabel(null), 1800)
  }

  const handleGesture = useCallback((gesture: GestureType) => {
    if (!gesture) return
    showToast(GESTURE_LABELS[gesture])

    if (gesture === 'swipe-left') {
      sectionIndexRef.current = Math.min(sectionIndexRef.current + 1, SECTIONS.length - 1)
      document.querySelector(SECTIONS[sectionIndexRef.current])?.scrollIntoView({ behavior: 'smooth' })
    }
    if (gesture === 'swipe-right') {
      sectionIndexRef.current = Math.max(sectionIndexRef.current - 1, 0)
      document.querySelector(SECTIONS[sectionIndexRef.current])?.scrollIntoView({ behavior: 'smooth' })
    }
    if (gesture === 'palm') toggleTheme()
    if (gesture === 'wave') {
      document.getElementById('hero-title')?.classList.add('animate-bounce')
      setTimeout(() => document.getElementById('hero-title')?.classList.remove('animate-bounce'), 1000)
    }
  }, [toggleTheme])

  const { videoRef, canvasRef } = useHandGesture({ onGesture: handleGesture, enabled })

  const handleEnable = async () => {
    setLoading(true)
    // Small delay so the loading state is visible before WASM starts loading
    await new Promise(r => setTimeout(r, 100))
    setEnabled(true)
    setLoading(false)
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      {/* Webcam window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 h-48 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={256}
          height={192}
          className="absolute inset-0 h-full w-full scale-x-[-1]"
          role="img"
          aria-label="Hand landmark visualisation overlay"
        />

        {!enabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900/95 p-4">
            <div className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center">
              <span className="text-sm">📷</span>
            </div>
            <button
              onClick={handleEnable}
              disabled={loading}
              className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-xs text-accent-light transition hover:bg-accent/20 disabled:opacity-50"
            >
              {loading ? 'Loading model…' : 'Enable gesture control'}
            </button>
            <p className="text-center text-xs text-zinc-600">Requires camera permission</p>
          </div>
        )}

        {/* Corner accent */}
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-light/60 animate-pulse" />
      </motion.div>

      {/* Gesture hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {GESTURE_HINTS.map(h => (
          <span key={h.label} className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-500">
            {h.icon} {h.label}
          </span>
        ))}
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h1
          id="hero-title"
          className="text-5xl font-bold tracking-tight text-zinc-100 sm:text-6xl"
        >
          The Interactive<br />
          <span className="text-accent-light">Portfolio</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 text-balance max-w-md mx-auto">
          DSA · LLM · Machine Learning · NLP · Systems Programming · Full-Stack Web
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          — Krishn Kumar · Available for internships & Full-Time roles
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="h-8 w-5 rounded-full border border-zinc-700 flex items-start justify-center p-1">
          <motion.div
            className="h-1.5 w-1 rounded-full bg-zinc-500"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-xs text-zinc-700">scroll</span>
      </motion.div>

      {/* Gesture feedback toast */}
      <AnimatePresence>
        {gestureLabel && (
          <motion.div
            key={gestureLabel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            {gestureLabel}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}