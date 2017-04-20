/**
 * A Component has state and/or lifetime methods
 * that define the behaviors of the Entity it is
 * attached to.
 *
 * @abstract
 * @class Component
 */
abstract class Component {
  abstract name: string

  abstract setup (): void
  abstract update (dt: number): void
}

export default Component
