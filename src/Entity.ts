import Component from './Components/Component'

/**
 * Entity Class.
 */
export default class Entity {
  static count: number = 0

  id: string
  private components: { [name: string]: Component } = {}
  private children: { [name: string]: Entity } = {}

  constructor (components?: Component[], children?: Entity[]) {
    this.id = Entity.GENERATE_ID()
    Entity.count++

    if (components) {
      for (const component of components) {
        this.addComponent(component)
      }
    }
    if (children) {
      for (const child of children) {
        this.addChild(child)
      }
    }
  }

  /**
   * Handling Children
   */

  addChild (child: Entity): void {
    this.children[child.id] = child
  }

  /**
   * Handling Components
   */

  addComponent (component: Component): void {
    this.components[component.name] = component
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

  update (dt: number): void {
    for (const component of Object.values(this.components)) {
      component.update(dt)
    }
  }

  /**
   * Static Methods
   */

  static GENERATE_ID (): string {
    return (+new Date()).toString(16) +
      (Math.random() * 100000000 | 0).toString(16) +
      Entity.count
  }
}
