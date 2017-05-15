import * as most from 'most'

/**
 * Mouse input module
 */
const pressed: { [keyCode: number]: boolean } = {}
export let mouseX = 0
export let mouseY = 0

export const mousedown$ = most.fromEvent('mousedown', window, false)
export const mouseup$ = most.fromEvent('mouseup', window, false)
export const mousemove$ = most.fromEvent('mousemove', window, false)

const onMouseDown = (event: MouseEvent): void => {
  pressed[event.button] = true
}

const onMouseUp = (event: MouseEvent): void => {
  // pressed[event.button] = false
  delete pressed[event.button]
}

const onMouseMove = (event: MouseEvent): void => {
  mouseX = event.clientX
  mouseY = event.clientY
}

window.addEventListener('mouseup', onMouseUp, false)
window.addEventListener('mousedown', onMouseDown, false)
window.addEventListener('mousemove', onMouseMove, false)

export const isDown = (button: number): boolean => {
  return pressed[button]
}

export const BUTTONS: {[key: string]: number} = {
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4,
  BACK: 8,
  FORWARD: 16,
}
