import { Shader } from './Shader'
import { Matrix, Vec2 } from '../Math'

export default class Uniform {
  private _shader: Shader
  private _value: any

  name: string
  type: UniformType
  uniform: WebGLUniformLocation
  dirty: boolean

  get value(): any {
    return this._value
  }
  set value(a: any) {
    if (this._value != a) {
      this._value = a
      this._shader.dirty = true
      this.dirty = true
    }
  }

  set shader(s: Shader) {
    if (this._shader != null) {
      throw new Error('This Uniform is already attached to a shader')
    }
    this._shader = s
  }

  constructor(name: string, type: UniformType, value?: any) {
    this.name = name
    this.type = type
    this._value = value
  }
}

export enum UniformType {
  float = 'float',
  vec2 = 'vec2',
  vec3 = 'vec3',
  vec4 = 'vec4',
  floatArray = 'floatArray',
  vec2Array = 'vec2Array',
  vec3Array = 'vec3Array',
  vec4Array = 'vec4Array',

  mat2 = 'mat2',
  mat3 = 'mat3',
  mat4 = 'mat4',

  int = 'int',
  ivec2 = 'ivec2',
  ivec3 = 'ivec3',
  ivec4 = 'ivec4',
  intArray = 'intArray',
  ivec2Array = 'ivec2Array',
  ivec3Array = 'ivec3Array',
  ivec4Array = 'ivec4Array',

  sampler2D = 'sampler2D',
  sampler2DArray = 'sampler2DArray',

  samplerCube = 'samplerCube',
  samplerCubeArray = 'samplerCubeArray',

  bool = 'bool',
  bvec2 = 'bvec2',
  bvec3 = 'bvec3',
  bvec4 = 'bvec4',
}

export type SetUniformValueFunc = (
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation,
  value: any
) => void
export const setUniformValue: { [type: string]: SetUniformValueFunc } = {
  [UniformType.float]: (gl, location, value: number) => {
    gl.uniform1f(location, value)
  },
  [UniformType.vec2]: (gl, location, value: number[] | Vec2) => {
    if (value instanceof Vec2) {
      gl.uniform2f(location, value.x, value.y)
    } else {
      gl.uniform2f(location, value[0], value[1])
    }
  },
  [UniformType.vec3]: (gl, location, value: number[]) => {
    gl.uniform3f(location, value[0], value[1], value[2])
  },
  [UniformType.vec4]: (gl, location, value: number[]) => {
    gl.uniform4f(location, value[0], value[1], value[2], value[3])
  },
  [UniformType.floatArray]: (gl, location, value: Float32Array | number[]) => {
    gl.uniform1fv(location, value)
  },
  [UniformType.vec2Array]: (gl, location, value: Float32Array | number[]) => {
    gl.uniform2fv(location, value)
  },
  [UniformType.vec3Array]: (gl, location, value: Float32Array | number[]) => {
    gl.uniform3fv(location, value)
  },
  [UniformType.vec4Array]: (gl, location, value: Float32Array | number[]) => {
    gl.uniform4fv(location, value)
  },
  [UniformType.int]: (gl, location, value: number) => {
    gl.uniform1i(location, value)
  },
  [UniformType.ivec2]: (gl, location, value: number[] | Vec2) => {
    if (value instanceof Vec2) {
      gl.uniform2i(location, Math.round(value.x), Math.round(value.y))
    } else {
      gl.uniform2i(location, value[0], value[1])
    }
  },
  [UniformType.ivec3]: (gl, location, value: number[]) => {
    gl.uniform3i(location, value[0], value[1], value[2])
  },
  [UniformType.ivec4]: (gl, location, value: number[]) => {
    gl.uniform4i(location, value[0], value[1], value[2], value[3])
  },
  [UniformType.intArray]: (gl, location, value: Int32Array | number[]) => {
    gl.uniform1iv(location, value)
  },
  [UniformType.ivec2Array]: (gl, location, value: Int32Array | number[]) => {
    gl.uniform2iv(location, value)
  },
  [UniformType.ivec3Array]: (gl, location, value: Int32Array | number[]) => {
    gl.uniform3iv(location, value)
  },
  [UniformType.ivec4Array]: (gl, location, value: Int32Array | number[]) => {
    gl.uniform4iv(location, value)
  },
  [UniformType.mat2]: (gl, location, value: Float32Array | number[]) => {
    gl.uniformMatrix2fv(location, false, value)
  },
  [UniformType.mat3]: (
    gl,
    location,
    value: Float32Array | number[] | Matrix
  ) => {
    if (value instanceof Matrix) {
      gl.uniformMatrix3fv(location, false, value.toArray())
    } else {
      gl.uniformMatrix3fv(location, false, value)
    }
  },
  [UniformType.mat4]: (gl, location, value: Float32Array | number[]) => {
    gl.uniformMatrix4fv(location, false, value)
  },
}
