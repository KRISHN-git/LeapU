'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { GestureType } from '@/types/gesture'

const DEBOUNCE_MS = 400

interface UseHandGestureOptions {
  onGesture: (gesture: GestureType) => void
  enabled: boolean
}

export function useHandGesture({ onGesture, enabled }: UseHandGestureOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<any>(null)
  const lastGestureTime = useRef(0)
  const wristHistory = useRef<{ x: number; t: number }[]>([])
  const rafRef = useRef<number>(0)

  const classifyGesture = useCallback((landmarks: any[]): GestureType => {
    const wrist = landmarks[0]
    const fingertips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
    const mcps = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]]

    const allOpen = fingertips.every((tip, i) => tip.y < mcps[i].y - 0.06)

    const now = Date.now()
    wristHistory.current.push({ x: wrist.x, t: now })
    if (wristHistory.current.length > 12) wristHistory.current.shift()

    const recent = wristHistory.current.filter(p => now - p.t < 600)
    let reversals = 0
    for (let i = 2; i < recent.length; i++) {
      const d1 = recent[i - 1].x - recent[i - 2].x
      const d2 = recent[i].x - recent[i - 1].x
      if (d1 * d2 < -0.0008) reversals++
    }

    const fast = wristHistory.current.filter(p => now - p.t < 200)
    const deltaX = fast.length > 1 ? fast[fast.length - 1].x - fast[0].x : 0

    if (reversals >= 3) return 'wave'
    if (deltaX > 0.18) return 'swipe-right'
    if (deltaX < -0.18) return 'swipe-left'
    if (allOpen) return 'palm'
    return null
  }, [])

  const drawLandmarks = useCallback((landmarks: any[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ]
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)'
    ctx.lineWidth = 1.5
    CONNECTIONS.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height)
      ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height)
      ctx.stroke()
    })

    ctx.fillStyle = 'rgba(167, 139, 250, 0.9)'
    landmarks.forEach(pt => {
      ctx.beginPath()
      ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  const detect = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const landmarker = landmarkerRef.current
    if (!video || !canvas || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detect)
      return
    }

    const results = landmarker.detectForVideo(video, performance.now())

    if (results.landmarks.length > 0) {
      const lm = results.landmarks[0]
      drawLandmarks(lm, canvas)

      const gesture = classifyGesture(lm)
      const now = Date.now()
      if (gesture && now - lastGestureTime.current > DEBOUNCE_MS) {
        lastGestureTime.current = now
        onGesture(gesture)
      }
    } else {
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      wristHistory.current = []
    }

    rafRef.current = requestAnimationFrame(detect)
  }, [classifyGesture, drawLandmarks, onGesture])

  useEffect(() => {
    if (!enabled) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let stopped = false

    async function init() {
      const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      })

      if (stopped) return

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (stopped) { stream.getTracks().forEach(t => t.stop()); return }

      const video = videoRef.current!
      video.srcObject = stream
      await video.play()

      rafRef.current = requestAnimationFrame(detect)
    }

    init().catch(console.error)

    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      }
    }
  }, [enabled, detect])

  return { videoRef, canvasRef }
}