/**
 * 水波纹圈扩散效果
 * 扩散点材质类 不会覆盖在白膜上
 * @param {*} color  颜色
 * @param {*} duration 持续时间 毫秒
 * @param {*} count  波浪数量
 * @param {*} gradient 渐变曲率
 */

import { JulianDate, Property } from 'cesium'

export class CircleWaveMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'CircleWave'
  source = `
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec3 str = materialInput.str;
        float dis = distance(st, vec2(0.5, 0.5));
        float per = fract(time);
        if (abs(str.z) > 0.001) {
            discard;
        }
        if (dis > 0.5) {
            discard;
        } else {
            float perDis = 0.5 / count;
            float disNum;
            float bl = .0;
            for (int i = 0; i <= 9; i++) {
            if (float(i) <= count) {
                disNum = perDis *float(i) - dis + per / count;
                if (disNum > 0.0) {
                if (disNum < perDis) {
                    bl = 1.0 - disNum / perDis;
                } else if(disNum - perDis < perDis) {
                    bl = 1.0 - abs(1.0 - disNum / perDis);
                }
                material.alpha = pow(bl, gradient);
                }
            }
            }
        }
        material.diffuse = 1.5 * color.rgb;
        return material;
    }
    `

  _time = new Date().getTime()
  color = (Cesium as any).createPropertyDescriptor('color')
  duration = (Cesium as any).createPropertyDescriptor('duration')
  count = (Cesium as any).createPropertyDescriptor('count')
  gradient = (Cesium as any).createPropertyDescriptor('gradient')

  constructor(color: any, duration = 1000, count = 3, gradient = 0.1) {
    this.color = color
    this.duration = duration
    this.count = count
    this.gradient = gradient > 1 ? 1 : gradient < 0 ? 0 : gradient
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          color: new Cesium.Color(0, 1, 0, 0.5),
          time: 1,
          count: 1,
          gradient: 0.1,
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
    result.color = this.color || result.color || new Cesium.Color(0, 1, 0, 0.5)
    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
    result.count = this.count
    result.gradient = 1 + 10 * (1 - this.gradient)
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other || (other instanceof CircleWaveMaterialProperty && this.color === other.color)
    )
  }
}
