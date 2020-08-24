<template>
  <div :id="id" class="pk-markdown" />
</template>

<script>
import $ from 'jquery'
import Vue from 'vue/dist/vue.esm.js'
import axios from 'axios'
import Editor from 'tui-editor/dist/tui-editor-Editor-all'
import Viewer from 'v-viewer/src/component.vue'
import emojiJson from '../lib/emoji/emoji-json'
import { toggle } from '../lib/js/fullScreen'

export default {
  name: 'PkMarkdown',
  props: {
    value: { // 默认值
      type: String,
      default: ''
    },
    id: { // dom ID值，当一个页面有多个markdown时用id值进行区分
      type: String,
      required: false,
      default() {
        return `markdown-editor-${Math.floor(Math.random() * 100)}`
      }
    },
    options: { // editor 选项值，可参考官方文档
      type: Object,
      default() {
        return {}
      }
    },
    mode: { // 模式，有wysiwyg（所见即所得)和 markdown
      type: String,
      default: 'wysiwyg'
    },
    height: { // 容器高度
      type: String,
      required: false,
      default: '300px'
    },
    language: { // 语言
      type: String,
      required: false,
      default: 'zh_CN' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    },
    viewer: { // 是否展示页
      type: Boolean,
      required: false,
      default: false
    },
    showViewer: { // 是否使用viewer展示图片
      type: Boolean,
      required: false,
      default: true
    },
    divideImg: { // 是否需要将图片与文字分隔展示（需要有一个.img-list的dom容器装图片，且默认最多九张
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: { // placeholder
      type: String,
      default: ''
    },
    uploadUrl: { // 上传图片的地址，没有则默认转Base64
      type: String,
      default: ''
    },
    inputMode: { // 是否显示为输入框模式
      type: Boolean,
      default: false
    },
    imageMaxWidth: { // 图片展示时最大宽度
      type: Number,
      default: 800
    },
    imageMaxHeight: { // 图片展示时最大高度
      type: Number,
      default: 500
    }
  },
  data() {
    const hooks = {}
    if (this.uploadUrl) {
      hooks.addImageBlobHook = (file, callback) => {
        if (this.inputMode) {
          callback()
        } else {
          const myFormData = new FormData() // 根据获取到的form节点创建formdata对象
          myFormData.append('file', file) // 后台即可根据此name捕获到前台发送的数据或文件
          axios.post(this.uploadUrl, myFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(res => {
            const data = res.data
            if (data.code === 200) {
              callback(data.data, file.name)
            } else {
              this.$Message && this.$Message.error('上传失败，请稍后重试')
            }
          }).catch((err) => {
            console.log(err)
            this.$Message && this.$Message.error('上传失败，请稍后重试')
          })
        }
      }
    }
    if (this.viewer) {
      hooks.previewBeforeHook = (content) => {
        const $result = $('<div></div>')
        $result.append(content)
        $result.find('a').each((i, v) => {
          if ($(v).attr('href')) {
            $(v).attr('target', '_blank')
          }
        })
        const result = $result.html()
        $result.remove()
        return result
      }
    }
    return {
      editor: null,
      defaultOptions: {
        minHeight: '300px',
        previewStyle: 'vertical',
        useCommandShortcut: true,
        useDefaultHTMLSanitizer: true,
        usageStatistics: false,
        hideModeSwitch: false,
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          // 'indent',
          // 'outdent',
          'divider',
          'table',
          'image',
          'link',
          'divider',
          'code',
          'codeblock',
          'divider'
        ],
        placeholder: this.placeholder,
        hooks,
        exts: [
          'colorSyntax',
          // this.mode === 'wysiwyg' ? '' : 'scrollSync'
        ]
      },
      currentMode: this.mode
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, this.defaultOptions, this.options, this.inputMode ? {
        toolbarItems: [],
        hideModeSwitch: true,
        exts: [],
        initialEditType: 'wysiwyg'
      } : {})
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return options
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && (this.editor.getValue ? newValue !== this.editor.getValue() : true)) { // viewer是没有getValue和focus方法的
        this.setValue(newValue)
        this.editor.focus && this.editor.focus()
      }
    },
    language() {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.editor.height && this.editor.height(newValue)
    },
    mode(newValue) {
      this.editor.changeMode(newValue)
    },
    viewer() {
      this.destroyEditor()
      this.initEditor()
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
    this.editor.remove()
  },
  methods: {
    initEditor(isChangeMode, currentValue) {
      this.editor = Editor.factory(isChangeMode ? {
        el: document.getElementById(this.id),
        viewer: this.viewer,
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          this.currentMode === 'wysiwyg' ? '' : 'indent',
          this.currentMode === 'wysiwyg' ? '' : 'outdent',
          'divider',
          'table',
          'image',
          'link',
          'divider',
          'code',
          'codeblock',
          'divider'
        ],
        exts: [
          'colorSyntax',
          this.currentMode === 'wysiwyg' ? '' : 'scrollSync'
        ],
        ...this.editorOptions,
        initialEditType: this.currentMode,
      } : {
        el: document.getElementById(this.id),
        viewer: this.viewer,
        ...this.editorOptions
      })
      this.setValue(isChangeMode ? currentValue : this.value)
      if (!this.viewer) {
        // this.editor.on('change', () => {
        //   this.$emit('input', this.editor.getValue())
        // })
        this.toolbar = this.editor.getUI().getToolbar()
        !this.inputMode && this.addToolbarItem()
        this.editor.focus()
      }
      // 监听事件
      this.editor.on('change', () => {
        this.$emit('input-value', this.editor.getValue())
        this.$emit('input-html', this.editor.getHtml())
      })
      // 监听模式以改变缩进和减少缩进按钮
      this.editor.on('changeMode', () => {
        this.currentMode = this.editor.isWysiwygMode() ? 'wysiwyg' : 'markdown'
        const value = this.editor.getValue()
        this.destroyEditor()
        this.initEditor(true, value)
      })
    },
    /**
       * 增加自定义的toolbar
       */
    addToolbarItem() {
      this.initEmojiItem()
      this.initFullScreenItem()
    },
    /**
       * 生成emoji按钮
       */
    initEmojiItem() {
      const emoji = `<button class="emoji"></button>`
      // 添加emoji
      this.toolbar.insertItem(this.currentMode === 'wysiwyg' ? 21 : 22, {
        type: 'button',
        options: {
          name: 'emoji',
          $el: $(emoji),
          event: 'emojiButtonClicked',
          tooltip: 'emoji表情'
        }
      })
      const $emojiRoot = $('<ul></ul>')
      Object.values(emojiJson).map(v => {
        const emojiText = `&#x${v[0].substring(2)};`
        const $emoji = $(`<li class="emoji-icon">${emojiText}</li>`)
        $emoji.on('click', (e) => {
          this.editor.insertText(e.target.innerHTML)
          popup.hide()
        })
        $emojiRoot.append($emoji)
      })
      // 绑定点击emoji按钮事件
      const emojiButtonIndex = this.toolbar.indexOfItem('emoji')
      const $button = this.toolbar.getItem(emojiButtonIndex).$el
      this.editor.eventManager.addEventType('emojiButtonClicked')
      this.editor.eventManager.listen('emojiButtonClicked', () => {
        if (popup.isShow()) {
          popup.hide()
          return
        }

        const _$button$get = $button.get(0)
        const offsetTop = _$button$get.offsetTop
        const offsetLeft = _$button$get.offsetLeft

        popup.$el.css({
          top: offsetTop + $button.outerHeight(),
          right: _$button$get.parentElement.offsetWidth - offsetLeft - _$button$get.offsetWidth
        })

        popup.show()
      })
      // 生成emoji弹框
      const popup = this.editor.getUI().createPopup({
        header: false,
        title: false,
        content: $emojiRoot,
        className: 'emoji-list',
        $target: this.editor.getUI().getToolbar().$el,
        css: {
          'width': '300px',
          'height': '260px',
          'position': 'absolute'
        }
      })
      // 聚焦时弹框消失
      this.editor.eventManager.listen('focus', function() {
        popup.hide()
      })
    },
    /**
       * 生成全屏非全屏按钮
       */
    initFullScreenItem() {
      const $root = this.editor.getUI().$el
      this.editor.eventManager.addEventType('toggleFullScreen')
      this.editor.eventManager.listen('toggleFullScreen', function() {
        const $fullscreen = $($root).find('.fullscreen')
        if ($fullscreen.hasClass('exit-fullscreen')) {
          $fullscreen.removeClass('exit-fullscreen')
        } else {
          $fullscreen.addClass('exit-fullscreen')
        }
        toggle.toggleFullScreen($root[0])
      })
      this.toolbar.insertItem(this.currentMode === 'wysiwyg' ? 22 : 23, {
        type: 'button',
        options: {
          name: 'fullScreen',
          tooltip: '全屏/非全屏',
          event: 'toggleFullScreen',
          $el: $('<button class="fullscreen"></button>')
        }
      })
    },
    destroyEditor() {
      if (!this.editor) return
      this.editor.off('change')
    },
    setValue(value) {
      this.editor.setValue(value)
      if (this.viewer && this.showViewer) {
        this.viewerHandle()
      }
    },
    getValue() {
      return this.editor.getValue()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    },
    exec(cmd) {
      this.editor.exec(cmd)
    },
    /**
       * viewer模式处理
       */
    viewerHandle() {
      const mainDom = $(`#${this.id}`)
      mainDom.hide()
      this.$nextTick(() => {
        setTimeout(() => {
          const length = mainDom.find('img:not(.viewer-image)').length
          if (length !== 0) {
            const style = { maxHeight: this.imageMaxHeight + 'px', maxWidth: this.imageMaxWidth + 'px' }
            mainDom.find('img:not(.viewer-image)').each((i, v) => {
              const markedVue = new Vue({
                components: {
                  Viewer
                },
                data() {
                  return {
                    image: v.src,
                    style
                  }
                },
                template: `
                <viewer style="display: inline-block" :options="{toolbar: false, title: false, navbar: false}" :images="[image]">
                  <img :style="style" alt="${v.alt}" :src="image" class="viewer-image"/>
                </viewer>`
              }).$mount()
              if (this.divideImg) {
                $(v).remove()
                const $targetDom = mainDom.next('.img-list')
                $targetDom.children().length < 9 ? $targetDom.append(markedVue.$el) : ''
              } else {
                $(v).replaceWith(markedVue.$el)
              }
            })
            mainDom.show()
          } else {
            mainDom.show()
          }
        })
      })
    }
  }
}
</script>
<style scoped>
  @import '../../../node_modules/viewerjs/dist/viewer.css';
  @import '../../../node_modules/codemirror/lib/codemirror.css';
  @import "../lib/css/tui-color-picker.css";
  @import '../../../node_modules/tui-editor/dist/tui-editor.css';
  @import '../../../node_modules/tui-editor/dist/tui-editor-contents.css';
  @import "../lib/css/index.css";
</style>
