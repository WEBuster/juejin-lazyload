var lazyload = new JuejinLazyload('.image', {
  threshold: 0,
  interval: 200,
  debounce: true,
  reactive: true,
  infoGetter: function (element) {
    return {
      url: element.dataset.url,
      width: element.dataset.width,
      height: element.dataset.height
    }
  },
  onStateChange: function (state, url, element, lazyload) {
    console.log(state, url, element, lazyload)
  }
})
