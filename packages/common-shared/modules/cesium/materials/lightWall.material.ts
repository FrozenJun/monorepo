import { JulianDate, Property } from 'cesium'
import image from '../assets/wallgradients.png'

export class LightWallMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'LightWallMaterial'
  source = `
  czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));
        material.alpha = colorImage.a * color.a;
        material.diffuse =  2.5 * color.rgb  ;
        return material;
    }
  `

  color = (Cesium as any).createPropertyDescriptor('color')

  constructor(color: any) {
    this.color = color
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          color: new Cesium.Color(0, 1, 0, 0.5),
          image: image,
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
    result.image = image
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other || (other instanceof LightWallMaterialProperty && this.color === other.color)
    )
  }
}
