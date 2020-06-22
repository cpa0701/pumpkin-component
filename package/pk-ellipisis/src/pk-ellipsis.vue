<template>
  <div v-if="this.$slots.extra&&this.$slots.extra.length" :class="className+(isShowEllipsis?'showEllipsis':'')">
    <div
      ref="ellipsis"
      class="ellipsis-content"
      :title="hasTitle?title:''"
      :style="{ width: contentWidthUnit,display:(this.$slots.extra&&this.$slots.extra.length)?'inline':'' }"
      @click="triggerClick"
    ></div>
    <slot v-if="isShow" name="extra" />
  </div>
  <div
    v-else
    ref="ellipsis"
    class="ellipsis-content"
    :class="isShowEllipsis?'showEllipsis':''"
    :title="hasTitle?title:''"
    :style="{ width: contentWidthUnit}"
    @click="triggerClick"
  ></div>
</template>

<script>
let extraContent = ''
export default {
  name: 'PkEllipsis',
  props: {
    content: { // 内容
      type: String,
      default: ''
    },
    className: { // 样式名
      type: String,
      default: ''
    },
    hasTitle: { // 是否显示title，内容过长容易造成卡顿
      type: Boolean,
      default() {
        return true
      }
    },
    showEllipsis: { // 是否显示认为截断显示省略号，适用于卡顿页面
      type: Boolean,
      default() {
        return false
      }
    },
    contentWidth: { // 宽度，不传默认撑满
      type: Number,
      default: null
    },
    lines: { // 行数
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      nowLines: 0,
      isShowEllipsis: false,
      isShow: true
    }
  },
  computed: {
    title() {
      const div = document.createElement('div')
      div.innerHTML = this.content
      return div.innerText
    },
    contentWidthUnit() {
      return this.contentWidth == null || typeof (this.contentWidth) === 'undefined' ? '100%' : this.contentWidth + 'px'
    }
  },
  watch: {
    content() {
      this.calc()
    }
  },
  mounted() {
    if (this.$slots.extra && this.$slots.extra.length) {
      extraContent = this.$slots.extra[0].elm.innerHTML
    }
    this.calc()
  },
  methods: {
    triggerClick() {
      this.$emit('click')
    },
    calc() {
      const targetElement = this.$refs.ellipsis
      let lineHeight = window.getComputedStyle(targetElement)['line-height']
      if (typeof lineHeight === 'string') {
        lineHeight = 21
      } else {
        lineHeight = parseInt(lineHeight)
      }
      const at = this.lines * lineHeight
      let tempStr = this.content === null ? '' : this.content
      targetElement.innerHTML = tempStr
      let len = tempStr.length
      let i = 0
      if (targetElement.offsetHeight <= at) { // 如果所有文本在写入html后文本没有溢出，那不需要做溢出处理
        this.text = tempStr
        this.isShow = false
      } else { // 否则
        this.isShow = true
        if (!this.showEllipsis) {
          let temp = ''
          targetElement.innerHTML = temp
          while (targetElement.offsetHeight <= at) {
            temp = tempStr.substring(0, i + 1)
            i++
            targetElement.innerHTML = temp
          }
          const slen = temp.length
          tempStr = temp.substring(0, slen - 1)
          len = tempStr.length
          const lastChar = tempStr[len - 1]
          // 判断是否是中文
          if (/[\u4E00-\u9FA5]/.test(lastChar) || len < 4) {
            targetElement.innerHTML = tempStr.substring(0, len - 1 - extraContent.length) + '...' // 替换string后面三个字符
            targetElement.height = at + 'px' // 修改文本高度 为了让CSS样式overflow：hidden生效
          } else {
            // 如果倒数第二个是中文，则只切两个
            const shearLen = /[\u4E00-\u9FA5]/.test(tempStr[len - 2]) ? 2 : 3
            targetElement.innerHTML = tempStr.substring(0, len - shearLen - extraContent.length) + '...' // 替换string后面三个字符
            targetElement.height = at + 'px' // 修改文本高度 为了让CSS样式overflow：hidden生效
          }
        } else {
          targetElement.style.height = at + 'px'
          this.isShowEllipsis = true
        }
      }
      this.getContentLines()
    },
    getContentLines() {
      const targetElement = this.$refs.ellipsis
      const lineHeight = parseInt(window.getComputedStyle(targetElement)['line-height'])
      this.nowLines = Math.ceil(targetElement.offsetHeight / lineHeight)
      this.$emit('ChangeLines', this.nowLines)
      return this.nowLines
    }
  }
}
</script>
<style scoped>
  @import "../lib/css/index.css";
</style>
