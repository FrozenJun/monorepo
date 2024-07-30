import { h, Transition } from 'vue'

const duration = 200
const enterTimingFunc = 'ease-in'
const leaveTimingFunc = 'ease-out'

const second = duration / 1000
const elEnterTransition = `${second}s height ${enterTimingFunc}, ${second}s padding-top ${enterTimingFunc}, ${second}s padding-bottom ${enterTimingFunc}`
const elLeaveTransition = `${second}s height ${leaveTimingFunc}, ${second}s padding-top ${leaveTimingFunc}, ${second}s padding-bottom ${leaveTimingFunc}`
const TransitionEvent = {
  onBeforeEnter(el: any) {
    el.style.transition = elEnterTransition
    if (!el.dataset) el.dataset = {}

    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom

    el.style.height = 0
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  },

  onEnter(el: any, done: any) {
    el.dataset.oldOverflow = el.style.overflow
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    } else {
      el.style.height = ''
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }

    el.style.overflow = 'hidden'
    setTimeout(done, duration)
  },

  onAfterEnter(el: any) {
    el.style.transition = ''
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
  },

  onBeforeLeave(el: any) {
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.height = el.scrollHeight + 'px'
    el.style.overflow = 'hidden'
  },

  onLeave(el: any, done: any) {
    if (el.scrollHeight !== 0) {
      el.style.transition = elLeaveTransition
      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
    setTimeout(done, duration)
  },

  onAfterLeave(el: any) {
    el.style.transition = ''
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
    el.style.paddingTop = el.dataset.oldPaddingTop
    el.style.paddingBottom = el.dataset.oldPaddingBottom
  },
}

export const CollapseTransition = (props: any, context: any) => {
  return h(Transition, TransitionEvent, context.slots)
}
