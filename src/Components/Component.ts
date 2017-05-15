import Entity from '../Entity'

/**
 * A Component has state and/or lifetime methods
 * that define the behaviors of the Entity it is
 * attached to.
 *
 * @export
 * @abstract
 * @class Component
 */
export abstract class Component {
  abstract name: string
  entity: Entity

  abstract setup (): void
}
