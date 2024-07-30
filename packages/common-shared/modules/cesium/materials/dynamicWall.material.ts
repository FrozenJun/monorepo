import { JulianDate, Property } from 'cesium'
import image from '../assets/dynamicWall.png'

export class DynamicWallMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'DynamicWall'
  source = `
  czm_material czm_getMaterial(czm_materialInput materialInput)
    {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));
    vec4 fragColor;
    fragColor.rgb = color.rgb / 1.0;
    fragColor = czm_gammaCorrect(fragColor);
    material.alpha = colorImage.a * color.a;
    material.diffuse = color.rgb;
    material.emission = fragColor.rgb;
    return material;
    }
  `

  _time = new Date().getTime()
  color = (Cesium as any).createPropertyDescriptor('color')
  duration = 1000

  constructor({ color, duration = 3000 }: { color: any; duration?: number }) {
    this.color = color
    this.duration = duration
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          color: new Cesium.Color(0, 1, 0, 0.5),
          image,
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
    result.color = this.color || result.color
    result.image = result.image || image
    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other || (other instanceof DynamicWallMaterialProperty && this.color === other.color)
    )
  }
}
