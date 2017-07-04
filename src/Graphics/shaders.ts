import { Shader, ShaderData } from './Shader'
import { UniformType } from './Uniform'
import { AttributeType } from './Attribute'

export class Shaders {
  static texture: Shader
  static solid: Shader
  static primitive: Shader

  static init() {
    Shaders.texture = new Shader(Shaders.shaderSources.texture)
    Shaders.solid = new Shader(Shaders.shaderSources.solid)
    Shaders.primitive = new Shader(Shaders.shaderSources.primitive)
  }

  static shaderSources: { [name: string]: ShaderData } = {
    texture: {
      vert: `
        attribute vec2 a_position;
        attribute vec2 a_texcoord;
        attribute vec4 a_color;

        uniform mat3 matrix;
        varying vec2 v_texcoord;
        varying vec4 v_color;

        void main() {
          gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
          v_texcoord = a_texcoord;
          v_color = vec4(a_color.rgb * a_color.a, a_color.a);
        }
      `,
      frag: `
        precision mediump float;
        varying vec2 v_texcoord;
        varying vec4 v_color;
        uniform sampler2D texture;

        void main() {
          gl_FragColor = texture2D(texture, v_texcoord) * v_color;
        }
      `,
      uniforms: [
        { name: 'matrix', type: UniformType.mat3 },
        { name: 'texture', type: UniformType.sampler2D },
      ],
      attributes: [
        { name: 'a_position', type: AttributeType.Position },
        { name: 'a_texcoord', type: AttributeType.Texcoord },
        { name: 'a_color', type: AttributeType.Color },
      ],
    },
    solid: {
      vert: `
        attribute vec2 a_position;
        attribute vec2 a_texcoord;
        attribute vec4 a_color;

        uniform mat3 matrix;
        varying vec2 v_texcoord;
        varying vec4 v_color;

        void main() {
          gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
          v_texcoord = a_texcoord;
          v_color = a_color;
        }
      `,
      frag: `
        precision mediump float;
        varying vec2 v_texcoord;
        varying vec4 v_color;
        uniform sampler2D texture;

        void main() {
          gl_FragColor = v_color * texture2D(texture, v_texcoord).a;
        }
      `,
      uniforms: [
        { name: 'matrix', type: UniformType.mat3 },
        { name: 'texture', type: UniformType.sampler2D },
      ],
      attributes: [
        { name: 'a_position', type: AttributeType.Position },
        { name: 'a_texcoord', type: AttributeType.Texcoord },
        { name: 'a_color', type: AttributeType.Color },
      ],
    },
    primitive: {
      vert: `
        attribute vec2 a_position;
        attribute vec4 a_color;

        uniform mat3 matrix;
        varying vec4 v_color;

        void main() {
          gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
          v_color = a_color;
        }
      `,
      frag: `
        precision mediump float;
        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color;
        }
      `,
      uniforms: [{ name: 'matrix', type: UniformType.mat3 }],
      attributes: [
        { name: 'a_position', type: AttributeType.Position },
        { name: 'a_color', type: AttributeType.Color },
      ],
    },
  }
}