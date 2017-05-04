/**
 * Mouse input module
 */
const pressed: { [keyCode: number]: boolean } = {}

const onMouseDown = (event: MouseEvent): void => {
  pressed[event.button] = true
}

const onMouseUp = (event: MouseEvent): void => {
  // pressed[event.button] = false
  delete pressed[event.button]
}

window.addEventListener('mouseup', onMouseUp, false)
window.addEventListener('mousedown', onMouseDown, false)

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
