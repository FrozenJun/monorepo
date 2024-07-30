// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import Effect from './effect'
// 雷达平扫
/**
 * step 正为逆时针，负为顺时针
 */
export class RaderScanEffect extends Effect {
  step: number
  scanColor: string
  constructor(viewer: any, id: string) {
    super(viewer, id)
    this.step = -0.2
    this.scanColor = 'rgba(19, 206, 102, 0.8)'
  }
  change_step(step: number) {
    this.step = step
  }
  change_color(val: string) {
    // 将颜色转成rgba格式
    this.scanColor = val
  }
  add(position: any, scanColor: string, radius: number, step: number, isedit = false) {
    // 将颜色转成rgba格式
    const cesiumColor = Cesium.Color.fromCssColorString(scanColor).withAlpha(1)
    const color = `rgba(${cesiumColor.red * 255}, ${cesiumColor.green * 255}, ${
      cesiumColor.blue * 255
    }, ${cesiumColor.alpha})`

    super.add(position, color, radius, step, isedit)
    this.step = step
    this.scanColor = color
    let rotation = 0

    // 因为画布内变化CallbackProperty监控不到，所以用两个画布切换的方式达成效果
    const linkA = document.createElement('canvas')
    linkA.setAttribute('width', '800px')
    linkA.setAttribute('height', '800px')
    linkA.setAttribute('id', 'canvas-a')
    const linkB = document.createElement('canvas')
    linkB.setAttribute('width', '800px')
    linkB.setAttribute('height', '800px')
    linkB.setAttribute('id', 'canvas-b')
    let canvasCollection: any = linkA

    this.viewer.entities.add({
      id: this.id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty((n: any) => {
          return this.radius
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty((n: any) => {
          return this.radius
        }, false),
        rotation: new Cesium.CallbackProperty(() => {
          rotation -= this.step || -0.02
          return rotation
        }, false),
        stRotation: new Cesium.CallbackProperty(() => {
          rotation -= this.step || -0.02
          return rotation
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(() => {
            /**
             * 使用canvas画出
             */
            canvasCollection = canvasCollection.id === 'canvas-a' ? linkB : linkA // 切换画布
            const context = canvasCollection.getContext('2d')
            context.clearRect(0, 0, canvasCollection.width, canvasCollection.height) // 清空画布
            const scanColor0 = this.scanColor || 'rgba(255,0,0,1)'
            const scanColorTmp = scanColor0.split(',')
            scanColorTmp[3] = '0)'
            const scanColor1 = scanColorTmp.join()
            const grd = context.createLinearGradient(
              175,
              100,
              canvasCollection.width,
              canvasCollection.height / 2
            )
            grd.addColorStop(0, scanColor0)
            grd.addColorStop(1, scanColor1)
            context.fillStyle = grd
            context.beginPath()
            context.moveTo(400, 400)
            context.arc(400, 400, 400, (-30 / 180) * Math.PI, (0 / 180) * Math.PI)
            context.fill()
            return canvasCollection
          }, false),
          transparent: true,
        }),
      },
    })
  }
}
export default RaderScanEffect
