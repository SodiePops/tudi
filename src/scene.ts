import * as most from 'most'

import { Game } from './game'
import { Entity } from './entity'
import { ActionChannel } from './util/actionChannel'
import { Camera } from './components/camera'
import { Shaders } from './graphics/shaders'
import { RenderInstructionType } from './graphics'
import { Color } from './util/color'
import { Vec2 } from './math'

/**
 * A Scene is the root of a hierarchy of entities.
 * It handles propagating of events through the
 * scene hierarchy.
 */
export class Scene {
  /**
   * Reference to the 'main' camera. By default this is the
   * first camera added to the scene hierarchy.
   */
  mainCamera: Camera = null
  /** List of all camera components in the scene */
  cameras: Camera[] = []
  /** Number of entities currently in the scene */
  entityCount: number
  /**
   * A dictionary of root-level entities. These entities may
   * contain additional entities as children.
   */
  entities: { [name: string]: Entity } = {}
  /** A most.js stream that fires once per update */
  update$: most.Stream<number>
  /** A channel that uses streams to broadcast actions */
  actions: ActionChannel = new ActionChannel()

  constructor(entities: Entity[]) {
    for (const entity of entities) {
      this.entities[entity.id] = entity
    }
  }

  /** Add an entity at the root level of the scene */
  addEntity(e: Entity): void {
    this.entities[e.id] = e
    e.scene = this
    e.setup()
  }

  /**
   * Remove an entity from the scene
   * 
   * TODO: This only removes entities if they are at the root level.
   * Add a level-order search of the hierarchy to remove an entity
   * from anywhere in the scene.
   */
  removeEntity(id: string): Entity | void {
    if (this.entities[id]) {
      this.entityCount--
      const entity = this.entities[id]
      delete this.entities[id]
      return entity
    }
  }

  /**
   * Sets up the scene. Calls the setup functions of
   * each of the scene's child entities.
   */
  async setup(): Promise<void> {
    this.update$ = Game.update$.map(this.update.bind(this))

    for (const entity of Object.values(this.entities)) {
      entity.scene = this
      entity.setup()
    }

    // Create a default camera entity if scene was started without one
    if (!this.mainCamera) {
      this.addEntity(Camera.createDefaultCameraEntity())
    }
  }

  /**
   * Scene's update loop. Draws each camera to the screen.
   */
  update(dt: number) {
    // Tell each camera to draw
    for (const camera of this.cameras) {
      camera.draw()
    }
    // Clear each shader's render queue
    for (const shader of Game.shaders) {
      shader.renderQueue = []
    }
    return dt
  }

  /**
   * Destroys this scene.
   */
  async destroy() {
    this.update$ = null
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color = Color.white
  ) {
    Shaders.primitive.renderQueue.push({
      type: RenderInstructionType.RECT,
      x,
      y,
      width,
      height,
      color,
    })
  }

  drawHollowRect(
    x: number,
    y: number,
    width: number,
    height: number,
    stroke: number,
    color: Color = Color.white
  ) {
    Shaders.primitive.renderQueue.push({
      type: RenderInstructionType.HOLLOWRECT,
      x,
      y,
      width,
      height,
      stroke,
      color,
    })
  }

  drawQuad(a: Vec2, b: Vec2, c: Vec2, d: Vec2, color: Color = Color.white) {
    Shaders.primitive.renderQueue.push({
      type: RenderInstructionType.QUAD,
      a,
      b,
      c,
      d,
      colA: color,
    })
  }

  drawTriangle(a: Vec2, b: Vec2, c: Vec2, color: Color = Color.white) {
    Shaders.primitive.renderQueue.push({
      type: RenderInstructionType.TRIANGLE,
      a,
      b,
      c,
      colA: color,
    })
  }

  drawCircle(pos: Vec2, rad: number, color: Color = Color.white) {
    Shaders.primitive.renderQueue.push({
      type: RenderInstructionType.CIRCLE,
      pos,
      rad,
      steps: 20,
      color,
    })
  }
}
