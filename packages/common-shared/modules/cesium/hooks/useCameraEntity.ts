import { Cartesian3, CallbackProperty, ImageMaterialProperty } from 'cesium'

/**
 * 摄像头实体hook
 */
export function useCameraEntity({
  position,
  angle,
  direction,
  color = '#E94E4E', // 红色
  radius = 5000,
}: {
  position: number[]
  angle: number
  direction: number
  color?: string
  radius?: number
}) {
  // 将颜色转成rgba格式
  const cesiumColor = Cesium.Color.fromCssColorString(color).withAlpha(1)
  const rgba = `rgba(${cesiumColor.red * 255}, ${cesiumColor.green * 255}, ${
    cesiumColor.blue * 255
  }, ${cesiumColor.alpha})`
  let canvas: HTMLCanvasElement
  const size = 800 // canvas宽高

  return {
    position: Cartesian3.fromDegrees(position[0], position[1], position[2] || 0),
    ellipse: {
      semiMinorAxis: new CallbackProperty((n: any) => {
        return radius
      }, false),
      semiMajorAxis: new CallbackProperty((n: any) => {
        return radius
      }, false),
      rotation: new CallbackProperty(() => {
        return direction
      }, false),
      stRotation: new CallbackProperty(() => {
        return direction
      }, false),
      material: new ImageMaterialProperty({
        image: new CallbackProperty(() => {
          /**
           * 使用canvas画出
           */
          if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.setAttribute('width', `${size}px`)
            canvas.setAttribute('height', `${size}px`)
          }
          const context = canvas.getContext('2d') as CanvasRenderingContext2D
          context.clearRect(0, 0, size, size) // 清空画布
          const rgbaTmp = rgba.split(',')
          // 创建径向渐变
          const grd = context.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
          )

          grd.addColorStop(0, `${rgbaTmp[0]},${rgbaTmp[1]},${rgbaTmp[2]}, 0.5`)
          grd.addColorStop(1, `${rgbaTmp[0]},${rgbaTmp[1]},${rgbaTmp[2]}, 0`)
          context.fillStyle = grd
          context.beginPath()
          context.moveTo(size / 2, size / 2)
          context.arc(size / 2, size / 2, size / 2, (0 / 180) * Math.PI, (angle / 180) * Math.PI)
          context.fill()
          return canvas
        }, false),
        transparent: true,
      }),
      height: position[2] || 0,
      extrudedHeight: position[2] || 0,
    },
  }
}
