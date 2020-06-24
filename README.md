# pk-view

![https://img.shields.io/badge/tui.editor-1.4.10-green](https://img.shields.io/badge/tui.editor-1.4.10-green)
![https://img.shields.io/badge/spark--md5-3.0.1-orange](https://img.shields.io/badge/spark--md5-3.0.1-orange)
![https://img.shields.io/badge/vue-2.6.10-brightgreen](https://img.shields.io/badge/vue-2.6.10-brightgreen)
![https://img.shields.io/badge/vue--cli-3.9.2-orange](https://img.shields.io/badge/vue--cli-3.9.2-orange)
![https://img.shields.io/badge/jquery-3.4.1-yellowgreen](https://img.shields.io/badge/jquery-3.4.1-yellowgreen)
![https://img.shields.io/badge/v--viewer-1.4.2-yellowgreen](https://img.shields.io/badge/v--viewer-1.4.2-red)
![https://img.shields.io/badge/axios-0.19.2-yellowgreen](https://img.shields.io/badge/axios-0.19.2-blueviolet)

[pk生态服务平台](https://www.ccyunchina.com/#/) ellipsis组件，基于容器高度计算，可实现多行文本省略
[pk生态服务平台](https://www.ccyunchina.com/#/) 断点续传组件，基于websocket
[pk生态服务平台](https://www.ccyunchina.com/#/) markdown组件，基于tui.editor，所见即所得（wysiwyg)
## 一、pk-ellipsis
实现思路：根据lineHeight算出容器高度，在超出高度后逐字添加，在超出高度后停止
```javascript
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
```

## 二、pk-upload
实现思路：利用FileReader类去实现文件切片，然后通过websocket建立持续连接，切一段传一段，中途可暂停和恢复
```javascript
const blob = this.file.slice(this.cuLoaded, this.cuLoaded + this.step)
this.reader.readAsArrayBuffer(blob)
```
## 三、pk-markdown

### 1.文档地址与demo
[tui.editor](https://nhn.github.io/tui.editor/latest/)

[线上demo](https://rc001.chenpengan.top:81/markdown/)或dist目录下为demo文件

### 2.使用
`npm i pk-markdown`
```vue
<template>
  <div id="app">
    <pk-editor :upload-url="'/user-api/uploadFile/image'"/>
  </div>
</template>

<script>
  import PkMarkdown from "../package/pk-markdown"

  export default {
    name: 'App',
    components: {
      PkMarkdown
    }
  }
</script>
```
### 3.自定义属性
```javascript
{
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
  }
```
### 4.自定义功能
1. viewer模式处理
在viewer模式下调用viewer组件进行图片查看

```javascript
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
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200317150601444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NwYTA3MDE=,size_16,color_FFFFFF,t_70)

2. 文字与图片分离展示功能
根据需求传入参数divideImg可以将此图片抽出加入至临近的.img-list元素中进行展示

```javascript
if (this.divideImg) {
    $(v).remove()
    const $targetDom = mainDom.next('.img-list')
    $targetDom.children().length < 9 ? $targetDom.append(markedVue.$el) : ''
    } else {
    $(v).replaceWith(markedVue.$el)
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200317150622672.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NwYTA3MDE=,size_16,color_FFFFFF,t_70)

3.  添加emoji表情

```javascript
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
  }
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200317150751780.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NwYTA3MDE=,size_16,color_FFFFFF,t_70)

4.  添加全屏功能

```javascript
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
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200317150822329.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NwYTA3MDE=,size_16,color_FFFFFF,t_70)

5. 限制图片展示时的比例大小

```javascript
const style = { maxHeight: this.imageMaxHeight + 'px', maxWidth: this.imageMaxWidth + 'px' }
```
