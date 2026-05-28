'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function generateFrame(i: number) {
  return {
    t: i,
    fps: 28 + Math.sin(i * 0.3) * 3 + (Math.random() - 0.5) * 2,
    latency: 32 + Math.cos(i * 0.2) * 6 + (Math.random() - 0.5) * 4,
    objects: Math.round(4 + Math.sin(i * 0.15) * 2 + Math.random()),
  }
}

const STATIC_DATA = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  fps: 28,
  latency: 32,
  objects: 4,
}))

export function VisionShowcase() {
  const [data, setData] = useState(STATIC_DATA)
  const [frame, setFrame] = useState(20)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setMounted(true)
    intervalRef.current = setInterval(() => {
      setFrame(f => {
        const next = f + 1
        setData(prev => [...prev.slice(1), generateFrame(next)])
        return next
      })
    }, 500)
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [])

  const latest = data[data.length - 1]

  const STATS = [
    { label: 'FPS', value: latest.fps.toFixed(1), unit: '', color: 'text-emerald-400' },
    { label: 'Latency', value: latest.latency.toFixed(0), unit: 'ms', color: 'text-sky-400' },
    { label: 'Objects', value: String(latest.objects), unit: ' detected', color: 'text-amber-400' },
    { label: 'Model', value: 'YOLOv8n', unit: '', color: 'text-accent-light' },
  ]

  return (
    <section id="vision" className="mx-auto max-w-6xl px-6 py-32 border-t border-zinc-800">
      <div className="mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-accent-light">Computer Vision</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-100">Vision Lab</h2>
        <p className="mt-3 max-w-lg text-zinc-400">
          Real-time object detection and behavior analysis pipelines. Simulated telemetry — swap in live WebSocket data from your backend.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Video panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
        >
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-zinc-600 font-mono">demo.mp4</span>
          </div>
          <div className="aspect-video bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-700 text-sm font-mono px-4 text-center">
              Drop demo video at /public/videos/demo.mp4
            </p>
          </div>
        </motion.div>

        {/* Telemetry panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-600 uppercase tracking-wider">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold font-mono ${stat.color}`}>
                  {/* Only show live values after mount to avoid hydration mismatch */}
                  {mounted ? stat.value : '—'}
                  <span className="text-sm font-normal text-zinc-500">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-xs text-zinc-600 uppercase tracking-wider">FPS over time</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={data}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[20, 35]} hide />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
                  labelStyle={{ color: '#71717a' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Line type="monotone" dataKey="fps" stroke="#a78bfa" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-xs text-zinc-600 uppercase tracking-wider">Inference latency (ms)</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={data}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[20, 50]} hide />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
                  labelStyle={{ color: '#71717a' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#38bdf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  )
}