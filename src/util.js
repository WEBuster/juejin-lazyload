export function on (element, eventName, fn, useCapture = false) {
  element.addEventListener(eventName, fn, useCapture)
  return function () {
    element.removeEventListener(eventName, fn, useCapture)
  }
}

export function getViewportSize () {
  const root = document.documentElement
  return {
    width: Math.max(root.clientWidth, window.innerWidth || 0),
    height: Math.max(root.clientHeight, window.innerHeight || 0)
  }
}

export function loadIamge (url, onLoaded, onError) {
  if (!url) { return }
  const image = new Image()
  image.onload = function () { onLoaded && onLoaded(url) }
  image.onerror = function () { onError && onError(url) }
  image.src = url
}

export function throttle (fn, interval) {
  let lastTime = 0
  interval = interval / 2
  return function (...args) {
    if (Date.now() - lastTime >= interval) {
      lastTime = Date.now()
      setTimeout(() => {
        fn.apply(null, args)
      }, interval)
    }
  }
}

export function debounce (fn, delay) {
  let token = 0
  return function (...args) {
    clearTimeout(token)
    token = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function getPlaceholderDataUrl (width, height) {
  return [
    'data:image/svg+xml;utf8,',
    '<?xml version="1.0"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" ',
    `width="${width}" height="${height}"`,
    '></svg>'
  ].join('')
}

export function isInArea (areaRect, tarRect) {
  return !(
    tarRect.bottom < areaRect.top ||
    tarRect.top > areaRect.bottom ||
    tarRect.right < areaRect.left ||
    tarRect.left > areaRect.right
  )
}