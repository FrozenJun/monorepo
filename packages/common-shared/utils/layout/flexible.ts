/**
 * rem计算方式：设计图尺寸px / 100 = 实际rem  例: 100px = 1rem
 */
const flexible = function (window: Window) {
  /* 设计图文档宽度 */
  const docWidth = 1920

  const doc = window.document
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

  const recalc = (function refreshRem() {
    let clientWidth = docEl.getBoundingClientRect().width
    const clientHeight = docEl.getBoundingClientRect().height

    const screenRatio = clientWidth / clientHeight
    const screenRatioByDesign = 16 / 9
    clientWidth =
      screenRatio > screenRatioByDesign ? clientHeight * screenRatioByDesign : clientWidth

    /* 15：75px = 小于1440px(1920 * 75 / 100)不再缩小 */
    docEl.style.fontSize = Math.max(20 * (clientWidth / docWidth), 15) * 5 + 'px'
    /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
    // docEl.style.fontSize =
    //   Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5 + 'px'

    return refreshRem
  })()

  /* 添加倍屏标识，安卓倍屏为1 */
  docEl.setAttribute(
    'data-dpr',
    window.navigator.appVersion.match(/iphone/gi) ? String(window.devicePixelRatio) : '1'
  )
  if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
    /* 添加IOS标识 */
    doc.documentElement.classList.add('ios')
    /* IOS8以上给html添加hairline样式，以便特殊处理 */
    const versionMath = window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/) || []
    if (parseInt(versionMath[1], 10) >= 8) doc.documentElement.classList.add('hairline')
  }

  if (!doc.addEventListener) return
  window.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
  return { resizeEvt, recalc }
}

export { flexible }
