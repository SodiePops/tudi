import {
  Component,
  Transform,
  TransformInitalizer,
} from './Components'
import Scene from './Scene'

// export interface Vec2 {x: number, y: number}
// export interface Transform {
//   pos: Vec2,
//   scale: Vec2,
//   pivot: Vec2,
//   skew: Vec2,
//   rotation: number,
// }

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
  // transform: Transform = {
  //   pos: {x: 0, y: 0},
  //   scale: {x: 0, y: 0},
  //   pivot: {x: 0, y: 0},
  //   skew: {x: 0, y: 0},
  //   rotation: 0,
  // }
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

  /**
   * Handling Children
   */

  addChild (child: Entity): void {
    this.children[child.id] = child
    child.scene = this.scene
    child.parent = this
    child.setup()
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
      // console.log(`Setting child's parent`, child.parent)
      child.setup()
    }
    // console.log('Parent', this.parent, 'Position', this.transform.position)
    // console.log('World position', this.transform.worldPosition)
  }

  update (dt: number): void {
    this.transform.update()
    for (const component of Object.values(this.components)) {
      component.update(dt)
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
