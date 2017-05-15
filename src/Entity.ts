import {
  Component,
  Transform,
  TransformInitalizer,
} from './Components'
import Scene from './Scene'

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
  private components: { [name: string]: Component } = {}
  private children: { [name: string]: Entity } = {}

  constructor (name: string, transform: TransformInitalizer, components?: Component[], children?: Entity[]) {
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

  destroy (): void {
    for (const component of Object.values(this.components)) {
      const c = <any>component
      if (c.destroy) c.destroy()
    }
    for (const child of Object.values(this.children)) {
      child.destroy()
    }

    if (this.parent) this.parent.removeChild(this.id)
    if (this.scene) this.scene.removeEntity(this.id)
  }

  /**
   * Handling Children
   */

  addChild (child: Entity): void {
    this.children[child.id] = child
    child.scene = this.scene
    child.parent = this
    child.setup()
  }

  removeChild (id: string): Entity | void {
    if (this.children[id]) {
      const child = this.children[id]
      delete this.children[id]
      return child
    }
  }

  getChild (idOrName: string): Entity | void {
    if (this.children[idOrName]) {
      return this.children[idOrName]
    } else {
      for (const child of Object.values(this.children)) {
        if (child.name === idOrName) {
          return child
        }
      }
    }
  }

  /**
   * Handling Components
   */

  addComponent (component: Component): void {
    this.components[component.name] = component
    component.entity = this
    component.setup()
  }

  removeComponent (componentName: string): Component | undefined {
    const removedComponent: Component = this.components[componentName]
    delete this.components[componentName]
    return removedComponent
  }

  hasComponent (componentName: string): boolean {
    return !!this.components[componentName]
  }

  getComponent (componentName: string): Component {
    return this.components[componentName]
  }

  setup (): void {
    this.scene.entityCount++
    this.transform.entity = this
    this.transform.setup()
    for (const component of Object.values(this.components)) {
      component.entity = this
      component.setup()
    }
    for (const child of Object.values(this.children)) {
      child.scene = this.scene
      child.parent = this
      child.setup()
    }
  }

  update (dt: number): void {
    this.transform.update()
    for (const component of Object.values(this.components)) {
      const c = <any>component
      if (c.update) c.update(dt)
    }
    for (const child of Object.values(this.children)) {
      child.update(dt)
    }
  }

  /**
   * Static Methods
   */

  static GENERATE_ID (): string {
    return (+new Date()).toString(16) +
      (Math.random() * 100000000 | 0).toString(16)
  }
}
