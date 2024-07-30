import { JulianDate, Property } from 'cesium'
import lineImage from '../assets/spriteline4.png'

export class SpriteLineMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'SpriteLineMaterial'
  source = `
  czm_material czm_getMaterial(czm_materialInput materialInput)
    {
    // 生成默认的基础材质
    czm_material material = czm_getDefaultMaterial(materialInput);
    // 获取st
    vec2 st = materialInput.st;
    // 根据uv采样颜色,fract(x)返回x的小数部分
    vec4 color = texture(image, vec2(fract(st.s-time) , st.t));
    // 设置材质的透明度
    material.alpha = color.a;
    material.diffuse = color.rgb;
    
    return material;
    }
  `

  _time = new Date().getTime()
  duration = 3000
  image = (Cesium as any).createPropertyDescriptor('image')

  constructor({ duration, image }: { image?: string; duration?: number } = {}) {
    this.image = image || lineImage
    this.duration = duration || this.duration
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          image: this.image,
          time: 0,
        },
        source: this.source,
      },
      translucent: function (t: any) {
        return true
      },
    })
  }

  getValue(time: JulianDate, result?: any) {
    if (!Cesium.defined(result)) {
      result = {}
    }

    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
    result.image = this.image
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other || (other instanceof SpriteLineMaterialProperty && this.image === other.image)
    )
  }
}
