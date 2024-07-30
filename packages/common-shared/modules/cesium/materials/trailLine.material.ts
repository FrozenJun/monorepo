import { JulianDate, Property } from 'cesium'

export class TrailLineMaterialProperty {
  readonly isConstant = false
  readonly definitionChanged = new Cesium.Event()
  name = 'TrailLineMaterial'
  source = `
    uniform vec4 color;
    uniform float speed;
    uniform float percent;
    uniform float gradient;

    czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float t = fract(czm_frameNumber * speed / 1000.0);
    t *= (1.0 + percent);
    float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
    alpha += gradient;
    material.diffuse = color.rgb;
    material.alpha = alpha;
    return material;
    }
  `

  color = (Cesium as any).createPropertyDescriptor('color')
  speed = (Cesium as any).createPropertyDescriptor('speed')
  gradient = (Cesium as any).createPropertyDescriptor('gradient')
  percent = (Cesium as any).createPropertyDescriptor('percent')

  constructor({
    color = Cesium.Color.RED,
    speed = 6 * Math.random(),
    percent = 0.1,
    gradient = 0.01,
  }: { speed?: number; color?: Cesium.Color; percent?: number; gradient?: number } = {}) {
    this.speed = speed
    this.color = color
    this.percent = percent
    this.gradient = gradient
    ;(Cesium.Material as any)._materialCache.addMaterial(this.name, {
      fabric: {
        type: this.name,
        uniforms: {
          color: new Cesium.Color(1, 0, 0, 0.5),
          transparent: true,
          speed: 0,
          gradient: 0.01,
          percent: 0.1,
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
    result.speed = this.speed
    result.gradient = this.gradient
    result.percent = this.percent
    return result
  }
  getType(time: JulianDate): string {
    return this.name
  }
  equals(other?: Property): boolean {
    return (
      this === other ||
      (other instanceof TrailLineMaterialProperty &&
        this.color === other.color &&
        this.speed === other.speed)
    )
  }
}
