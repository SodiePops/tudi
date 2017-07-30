import { Component, Transform, TransformInitalizer } from './Components'
import Scene from './Scene'
import ActionChannel from './Util/ActionChannel'
import { Subject, async as _async } from 'most-subject' // Why would they use a keyword??
import * as most from 'most'

/**
 * An Entity exists in the game world and has
 * a collection of Components that describe its
 * behavior.
 *
 * @export
 * @class Entity
 */
export default class Entity {
  name: string
  id: string
  scene: Scene
  transform: Transform
  parent: Entity = null
  // The reason destroy$ is a Subject and not a Stream is so we can
  // imperatively push a destroy event on demand
  destroy$: Subject<boolean>
  remove$: Subject<string>
  update$: most.Stream<number>
  actions: ActionChannel = new ActionChannel()
  readonly components: { [name: string]: Component } = {}
  private children: { [name: string]: Entity } = {}

  constructor(
    name: string,
    transform: TransformInitalizer,
    components?: Component[],
    children?: Entity[]
  ) {
    this.name = name
    this.id = Entity.GENERATE_ID()
    this.transform = new Transform(transform)
    if (components) {
      for (const component of components) {
        this.components[component.name] = component
      }
    }
    if (children) {
      for (const child of children) {
        this.children[child.id] = child
      }
    }
  }

  /**
   * Handling Children
   */

  addChild(child: Entity): void {
    this.children[child.id] = child
    child.scene = this.scene
    child.parent = this
    child.setup()
  }

  removeChild(id: string): Entity {
    if (this.children[id]) {
      const child = this.children[id]
      delete this.children[id]
      return child
    }
    return null
  }

  getChild(idOrName: string): Entity {
    if (this.children[idOrName]) {
      return this.children[idOrName]
    } else {
      for (const child of (<any>Object).values(this.children)) {
        if (child.name === idOrName) {
          return child
        }
      }
    }
    return null
  }

  /**
   * Handling Components
   */

  addComponent(component: Component): void {
    this.components[component.name] = component
    component.entity = this
    component.setup()
  }

  removeComponent(componentName: string): Component | undefined {
    this.remove$.next(componentName)
    const removedComponent: Component = this.components[componentName]
    delete this.components[componentName]
    return removedComponent
  }

  hasComponent(componentName: string): boolean {
    return !!this.components[componentName]
  }

  getComponent(componentName: string): Component {
    return this.components[componentName]
  }

  setup(): void {
    if (this.parent) {
      // Clone the parent entity's destroy stream
      this.destroy$ = <Subject<boolean>>this.parent.destroy$.map(e => e)
      this.update$ = this.parent.update$.takeUntil(this.destroy$)
    } else {
      this.destroy$ = _async<boolean>()
      this.update$ = this.scene.update$.takeUntil(this.destroy$)
    }
    this.remove$ = _async<string>()
    this.scene.entityCount++
    this.transform.entity = this
    this.transform.setup()
    for (const component of (<any>Object).values(this.components)) {
      component.entity = this
      component.setup()
    }
    for (const child of (<any>Object).values(this.children)) {
      child.scene = this.scene
      child.parent = this
      child.setup()
    }
  }

  destroy(): void {
    this.destroy$.next(true).complete(true)

    if (this.parent) this.parent.removeChild(this.id)
    if (this.scene) this.scene.removeEntity(this.id)
  }

  /**
   * Static Methods
   */

  static GENERATE_ID(): string {
    return (
      (+new Date()).toString(16) +
      ((Math.random() * 100000000) | 0).toString(16)
    )
  }
}
