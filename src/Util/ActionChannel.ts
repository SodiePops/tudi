import { Stream } from 'most'
import { Subject, async as _async } from 'most-subject'

export interface Action<T> {
  // tslint:disable-next-line
  type: string
  payload?: T
}

/**
 * Provides a source of actions to observe or push to
 */
export default class ActionChannel {
  action$: Subject<Action<any>>

  constructor() {
    this.action$ = _async<Action<any>>()
  }

  channel<T>(actionType: string): Stream<T> {
    return this.action$
      .filter(action => action.type === actionType)
      .map<T>(action => action.payload)
  }

  push(value: Action<any>): Subject<Action<any>> {
    return this.action$.next(value)
  }
}
