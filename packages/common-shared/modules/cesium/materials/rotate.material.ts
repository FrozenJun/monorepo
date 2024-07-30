import { JulianDate, Property } from 'cesium'

export class RotateMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'RotateMaterial'
  source = `
    czm_material czm_getMaterial(czm_materialInput materialInput)
        {
        // 生成默认的基础材质
        czm_material material = czm_getDefaultMaterial(materialInput);
        // 旋转uv
        vec2 newSt = mat2(
            cos(uTime),-sin(uTime),
            sin(uTime),cos(uTime)
        )*(materialInput.st-0.5);

        newSt = newSt+0.5;

        // 获取st
        vec2 st = newSt;
        
        // 设置圆，外部透明，内部不透明
        float alpha = 1.0 - step(0.5,distance(st,vec2(0.5))) ;
        
        // 按照角度来设置强弱
        float angle = atan(st.x-0.5,st.y-0.5);
        // angle是从-pi到pi的，所以如果要设置从0-1的转变，需要加上pi
        float strength = (angle+3.1416)/6.2832;

        // 将强弱与透明度结合
        alpha = alpha*strength;
        material.alpha = alpha;
        material.diffuse = vec3(st.x,st.y,1.0);
        return material;
        }
  `

  _time = new Date().getTime()
  duration = 1000

  constructor() {
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
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

    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return this === other || other instanceof RotateMaterialProperty
  }
}
