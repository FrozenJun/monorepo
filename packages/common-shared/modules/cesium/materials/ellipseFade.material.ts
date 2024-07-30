/**
 * 流动纹理线
 * 扩散点材质类 不会覆盖在白膜上
 * @param {*} color 颜色
 * @param {*} duration duration 持续时间 毫秒
 */

import { JulianDate, Property } from 'cesium'

export class EllipseFadeMaterialPropetry {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'EllipseFade'
  source = `
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);

        material.diffuse = 1.5 * color.rgb;
        vec2 st = materialInput.st;
        float dis = distance(st, vec2(0.5, 0.5));
    float bl = .0;
    float offset = 0.42;
    if( dis > 0.5) {
            material.alpha = 0.0;
            discard;
        }
    if( dis > offset) {
        bl = color.a * 1.0 / (0.5 - offset) * (dis - offset);
        material.alpha =  pow(bl, 3.0);
        } else {
        material.alpha = 0.0;
            discard;
    }
        return material;
    }
    `

  _time = new Date().getTime()
  color = (Cesium as any).createPropertyDescriptor('color')
  duration = 0

  constructor(color: any, duration = 3000) {
    this.color = color
    this.duration = duration
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          color: new Cesium.Color(0, 1, 0, 0.5),
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
    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other || (other instanceof EllipseFadeMaterialPropetry && this.color === other.color)
    )
  }
}
