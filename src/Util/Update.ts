import * as most from 'most'
import { create } from '@most/create'
/**
 * Creates a stream of update events using requestAnimationFrame
 */
export interface UpdateEvent {
  time: number
  deltaTime: number
}

export type UpdateHandler = (event: UpdateEvent) => void

export const update$ = create<UpdateEvent>(add => {
  let rafHandler: number
  let lastTime = Date.now()

  function update(time: number): void {
    rafHandler = requestAnimationFrame(update)
    // Push an event into the stream
    add({
      time,
      deltaTime: (time - lastTime) / 1000,
    })
    lastTime = time
  }
  rafHandler = requestAnimationFrame(update)

  // Return a dispose function to clean up when stream ends
  return () => cancelAnimationFrame(rafHandler)
})

export const subscribe = (f: UpdateHandler) => {
  const subscriber: most.Subscriber<UpdateEvent> = {
    next: f,
    error: null,
    complete: null,
  }
  const { unsubscribe } = update$.subscribe(subscriber)
  return unsubscribe
}
