/**
 * Component Class
 */
abstract class Component {
  abstract name: string

  abstract setup (): void
  abstract update (dt: number): void
}

export default Component
