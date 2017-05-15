/**
 * A System collectively handles the behavior of all
 * entities with a given set of components. Eg: the
 * PhysicsSystem updates all entities with colliders
 * and/or rigidbodies.
 *
 * @abstract
 * @class System
 */
abstract class System {
  abstract setup (): void
}

export default System
