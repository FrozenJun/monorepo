export const hasClass = function (obj: Element, cls: string) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export const addClass = function (obj: Element, cls: string) {
  if (!hasClass(obj, cls)) obj.className += ' ' + cls
}

export const removeClass = function (obj: Element, cls: string) {
  if (hasClass(obj, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    obj.className = obj.className.replace(reg, ' ')
  }
}

export const toggleClass = function (obj: Element, cls: string) {
  if (hasClass(obj, cls)) {
    removeClass(obj, cls)
  } else {
    addClass(obj, cls)
  }
}
