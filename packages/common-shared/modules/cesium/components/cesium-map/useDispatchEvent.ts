import { VcViewer } from 'vue-cesium'

// 冒泡cesium中接收到的鼠标事件
export function useDispatchEvent(
  viewer: Cesium.Viewer,
  element: HTMLElement & InstanceType<typeof VcViewer>
) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  let lastMousePosition = { x: 0, y: 0 }

  function createAndDispatchEvent(type, { x, y, deltaY = 0 }) {
    const Event = deltaY ? WheelEvent : MouseEvent
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      deltaY,
    })
    element.dispatchEvent ? element.dispatchEvent(event) : element.$el.dispatchEvent(event)
  }

  handler.setInputAction(function (movement) {
    createAndDispatchEvent('mousedown', movement.position)
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

  handler.setInputAction(function (movement) {
    createAndDispatchEvent('mouseup', movement.position)
    createAndDispatchEvent('click', movement.position)
  }, Cesium.ScreenSpaceEventType.LEFT_UP)

  handler.setInputAction(function (movement) {
    lastMousePosition = movement.endPosition
    createAndDispatchEvent('mousemove', movement.endPosition)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(function (movement) {
    createAndDispatchEvent('wheel', { ...lastMousePosition, deltaY: movement })
  }, Cesium.ScreenSpaceEventType.WHEEL)
}
