import * as most from 'most'

/**
 * Keyboard input module
 */

export interface KeyMap { [keyCode: number]: boolean }


// ----------
// Stream API
// ----------

const keyEventEquals = (_: KeyboardEvent, e2: KeyboardEvent) => e2.repeat

export const keydown$ = most.fromEvent<KeyboardEvent>('keydown', window, false).skipRepeatsWith(keyEventEquals)
export const keyup$ = most.fromEvent<KeyboardEvent>('keyup', window, false).skipRepeatsWith(keyEventEquals)

// Used to convert stream of key events into a stream of KeyMap objects
const scanKeysToKeyMap = (keys: KeyMap, evt: KeyboardEvent): KeyMap => {
  const newKeys = { ...keys }
  if (evt.type === 'keydown') {
    newKeys[evt.keyCode] = true
  } else {
    delete newKeys[evt.keyCode]
  }
  return newKeys
}

export const keyboard$ = most.merge(keydown$, keyup$)
  .scan(scanKeysToKeyMap, {})

/**
 * Creates a stream similar to `Keyboard.keyboard$` but only
 * emits events for given keys
 */
export const createInputStream = (keys: Set<number>): most.Stream<KeyMap> => {
  const keyFilter = (evt: KeyboardEvent) => keys.has(evt.keyCode)

  return most.merge(keydown$, keyup$)
    .filter(keyFilter)
    .scan(scanKeysToKeyMap, {})
}

// --------------
// Imperative API
// --------------

const pressed: KeyMap = {}
const onKeyDown = (event: KeyboardEvent): void => {
  pressed[event.keyCode] = true
}

const onKeyUp = (event: KeyboardEvent): void => {
  delete pressed[event.keyCode]
}

window.addEventListener('keyup', onKeyUp, false)
window.addEventListener('keydown', onKeyDown, false)

export const isDown = (keyCode: number): boolean => {
  return pressed[keyCode]
}


export const KEYS = {
  A: 'A'.charCodeAt(0),
  B: 'B'.charCodeAt(0),
  C: 'C'.charCodeAt(0),
  D: 'D'.charCodeAt(0),
  E: 'E'.charCodeAt(0),
  F: 'F'.charCodeAt(0),
  G: 'G'.charCodeAt(0),
  H: 'H'.charCodeAt(0),
  I: 'I'.charCodeAt(0),
  J: 'J'.charCodeAt(0),
  K: 'K'.charCodeAt(0),
  L: 'L'.charCodeAt(0),
  M: 'M'.charCodeAt(0),
  N: 'N'.charCodeAt(0),
  O: 'O'.charCodeAt(0),
  P: 'P'.charCodeAt(0),
  Q: 'Q'.charCodeAt(0),
  R: 'R'.charCodeAt(0),
  S: 'S'.charCodeAt(0),
  T: 'T'.charCodeAt(0),
  U: 'U'.charCodeAt(0),
  V: 'V'.charCodeAt(0),
  W: 'W'.charCodeAt(0),
  X: 'X'.charCodeAt(0),
  Y: 'Y'.charCodeAt(0),
  Z: 'Z'.charCodeAt(0),
  ZERO: '0'.charCodeAt(0),
  ONE: '1'.charCodeAt(0),
  TWO: '2'.charCodeAt(0),
  THREE: '3'.charCodeAt(0),
  FOUR: '4'.charCodeAt(0),
  FIVE: '5'.charCodeAt(0),
  SIX: '6'.charCodeAt(0),
  SEVEN: '7'.charCodeAt(0),
  EIGHT: '8'.charCodeAt(0),
  NINE: '9'.charCodeAt(0),
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  NUMPAD_MULTIPLY: 106,
  NUMPAD_ADD: 107,
  NUMPAD_ENTER: 108,
  NUMPAD_SUBTRACT: 109,
  NUMPAD_DECIMAL: 110,
  NUMPAD_DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  COLON: 186,
  EQUALS: 187,
  COMMA: 188,
  UNDERSCORE: 189,
  PERIOD: 190,
  QUESTION_MARK: 191,
  TILDE: 192,
  OPEN_BRACKET: 219,
  BACKWARD_SLASH: 220,
  CLOSED_BRACKET: 221,
  QUOTES: 222,
  BACKSPACE: 8,
  TAB: 9,
  CLEAR: 12,
  ENTER: 13,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACEBAR: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PLUS: 43,
  MINUS: 44,
  INSERT: 45,
  DELETE: 46,
  HELP: 47,
  NUM_LOCK: 144,
}
