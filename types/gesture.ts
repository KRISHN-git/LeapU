export type GestureType = 'wave' | 'swipe-left' | 'swipe-right' | 'palm' | null

export interface GestureEvent {
  type: GestureType
  timestamp: number
}