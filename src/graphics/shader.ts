import { Game } from '../game'
import { RenderInstruction } from '../graphics'
import { Uniform, UniformType } from './uniform'
import { Attribute, AttributeType } from './attribute'

/**
 * A WebGL shader. Consists of a vertex and fragment
 * shader, and uniform and attribute values.
 */
export class Shader {
  name: string
  program: WebGLProgram
  dirty: boolean = true
  sampler2D: Uniform
  uniforms: Uniform[]
  attributes: Attribute[]
  uniformsByName: { [key: string]: Uniform } = {}

  /**
   * An array of RenderInstructions. Each update loop,
   * this array is emptied and each instruction is rendered
   * by the camera(s) in the scene.
   */
  renderQueue: RenderInstruction[] = []

  constructor(data: ShaderData) {
    this.name = data.name
    const gl = Game.graphics.gl

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, data.vert)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader compilation error: ${gl.getShaderInfoLog(vertexShader)}`
      )
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, data.frag)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader compilation error: ${gl.getShaderInfoLog(fragmentShader)}`
      )
    }

    this.program = gl.createProgram()
    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          this.program
        )}`
      )
    }

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    this.attributes = data.attributes.map(a => {
      const attribute = new Attribute(a.name, a.type)
      attribute.attribute = gl.getAttribLocation(this.program, attribute.name)
      return attribute
    })

    this.uniforms = data.uniforms.map(u => {
      const uniform = new Uniform(u.name, u.type, u.value)
      uniform.shader = this
      uniform.uniform = gl.getUniformLocation(this.program, uniform.name)

      if (uniform.type === UniformType.sampler2D && !this.sampler2D) {
        this.sampler2D = uniform
      }

      this.uniformsByName[uniform.name] = uniform

      return uniform
    })
  }

  /** Sets a shader uniform value */
  set(name: string, value: any) {
    if (!this.uniformsByName[name]) {
      throw new Error(`Uniform ${name} does not exist on this shader.`)
    }
    this.uniformsByName[name].value = value
  }
}

/** A plain object used to create and compile a shader */
export interface ShaderData {
  name: string
  frag: string
  vert: string
  uniforms: { name: string; type: UniformType; value?: any }[]
  attributes: { name: string; type: AttributeType }[]
}
