import * as most from 'most'

/**
 * Mouse input module
 */

export interface ButtonMap { [button: number]: boolean }

// ----------
// Stream API
// ----------

export const mousedown$ = most
  .fromEvent('mousedown', window, false)
  .skipRepeats()
export const mouseup$ = most.fromEvent('mouseup', window, false).skipRepeats()
export const mousemove$ = most
  .fromEvent('mousemove', window, false)
  .skipRepeats()

export const mouse$ = most
  .merge(mousedown$, mouseup$)
  .scan((buttons: ButtonMap, evt: MouseEvent) => {
    const newButtons = { ...buttons }
    if (evt.type === 'mousedown') {
      newButtons[evt.button] = true
    } else {
      delete newButtons[evt.button]
    }
    return newButtons
  }, {})

// --------------
// Imperative API
// --------------

const pressed: ButtonMap = {}

export let mouseX = 0
export let mouseY = 0

export const isDown = (button: number): boolean => {
  return pressed[button]
}

const onMouseDown = (event: MouseEvent): void => {
  pressed[event.button] = true
}

const onMouseUp = (event: MouseEvent): void => {
  delete pressed[event.button]
}

const onMouseMove = (event: MouseEvent): void => {
  mouseX = event.clientX
  mouseY = event.clientY
}

window.addEventListener('mouseup', onMouseUp, false)
window.addEventListener('mousedown', onMouseDown, false)
window.addEventListener('mousemove', onMouseMove, false)

export const BUTTONS = {
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4,
  BACK: 8,
  FORWARD: 16,
}
