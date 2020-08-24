export const toggle = {
  isFullscreen: false,
  requestFullScreen(element) {
    return new Promise((resolve) => {
      const el = element || document.documentElement
      const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
        this.isFullscreen = true
        resolve(true)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        // for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        console.error('fullScreen 不支持IE')
        resolve(false)
      }
    })
  },
  exitFullScreen() {
    return new Promise((resolve) => {
      const el = document
      const cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el)
        this.isFullscreen = false
        resolve(true)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        // for IE，这里和fullScreen相同，模拟按下F11键退出全屏
        console.error('fullScreen 不支持IE')
        resolve(false)
      }
    })
  },
  toggleFullScreen(element) {
    return !this.isFullscreen ? this.requestFullScreen(element) : this.exitFullScreen()
  }
}
