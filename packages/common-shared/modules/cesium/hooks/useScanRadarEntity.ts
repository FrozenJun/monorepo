import { Cartesian3, CallbackProperty, ImageMaterialProperty } from 'cesium'

/**
 * 扫描雷达实体hook
 */
export function useScanRadarEntity({
  position,
  color = 'rgba(61, 126, 255, 1)', // 蓝色
  radius = 5000,
  step = -0.2,
}: {
  position: number[]
  color?: string
  radius?: number
  step?: number
}) {
  // 将颜色转成rgba格式
  const cesiumColor = Cesium.Color.fromCssColorString(color).withAlpha(1)
  const rgba = `rgba(${cesiumColor.red * 255}, ${cesiumColor.green * 255}, ${
    cesiumColor.blue * 255
  }, ${cesiumColor.alpha})`

  let time: number
  let canvas: HTMLCanvasElement
  let rotation = 0
  const angle = -90
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
        // time - 防止渲染问题导致转速不均匀
        if (!time) {
          time = new Date().getTime()
        } else {
          const cur = new Date().getTime()
          rotation -= (step * (cur - time)) / 100
          time = cur
        }
        return rotation
      }, false),
      stRotation: new CallbackProperty(() => {
        return rotation
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
          // 创建线性渐变
          const grd = context.createLinearGradient(size, size / 2, size / 2, 0)

          grd.addColorStop(0, `${rgbaTmp[0]},${rgbaTmp[1]},${rgbaTmp[2]}, 0.9`)
          grd.addColorStop(0.5, `${rgbaTmp[0]},${rgbaTmp[1]},${rgbaTmp[2]}, 0.02`)
          grd.addColorStop(1, `${rgbaTmp[0]},${rgbaTmp[1]},${rgbaTmp[2]}, 0`)
          context.fillStyle = grd
          context.beginPath()
          context.moveTo(size / 2, size / 2)
          context.arc(size / 2, size / 2, size / 2, (angle / 180) * Math.PI, (0 / 180) * Math.PI)
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
