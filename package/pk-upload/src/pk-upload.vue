<template>
  <div class="breakpoint-upload">
    <progress v-show="isShowProgress" :value="percent" :max="100"></progress><span>{{ percent }}%</span>
    <p v-if="file">{{ file.name }}<a v-if="file.url" :href="file.url" style="margin-left: 20px">下载</a></p>
    <Button :disabled="percent>0&&percent<100" class="breakpoint-btn" @click="triggerFile">点击上传文件</Button>
    <input id="breakpoint-file" type="file" @change="onchange($event)">
    <Button v-if="isShowSuspendBtn" class="suspend-btn" @click="suspend">暂停</Button>
    <Button v-if="isShowContinueBtn" class="continue-btn" @click="goOn">继续</Button>
    <Button v-if="isShowCancelBtn" class="cancel-btn" @click="cancel">取消</Button>
  </div>
</template>
<script>
import { md5File } from '../utils/md5'

export default {
  name: 'PkUpload',
  props: {
    /* 默认最大500M */
    maxSize: {
      type: Number,
      default() {
        return 500 * 1024 * 1024
      }
    },
    defaultFile: {
      type: Object,
      default() {
        return {}
      }
    },
    uploadUrl: {
      type: String,
      default: '',
      required: true
    },
    md5: {
      type: String,
      default: ''
    },
    needMd5: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: [String, Array],
      default: ''
    }
  },
  data() {
    return {
      ws: null,
      reader: null, // 读取操作对象
      step: 1024 * 64, // 每次读取文件大小，字节数
      cuLoaded: 0, // 当前已经读取总数
      file: this.defaultFile, // 当前读取的文件对象
      enableRead: true, // 标识是否可以读取文件
      total: 0, // 记录当前文件总总字节数
      startTime: null, // 标识开始上传时间
      isShowProgress: false,
      percent: 0,
      isShowCancelBtn: false,
      isShowSuspendBtn: false,
      isShowContinueBtn: false,
      fileTarget: null,
      currentMd5: this.md5,
      lockReconnect: false, // 避免ws重复连接
      timeout: 1000, // 1分钟发一次心跳
      timeoutObj: null,
      serverTimeoutObj: null,
    }
  },
  watch: {
    percent(newVal) {
      if (newVal > 0 && newVal < 100) {
        this.isShowCancelBtn = true
        this.isShowSuspendBtn = true
      } else if (newVal >= 100) {
        this.isShowSuspendBtn = false
      }
    }
  },
  beforeDestroy() {
    this.reset()
    this.suspend()
  },
  mounted() {
    try {
      if (!this.uploadUrl) {
        alert('未设置上传路径')
      } else {
        this.createWebSocket()
      }
    } catch (e) {
      this.reconnect()
    }
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = () => {
      this.ws.close()
    }
  },
  methods: {
    triggerFile() {
      document.querySelector('#breakpoint-file').click()
    },
    // 创建和服务器的WebSocket 链接
    createWebSocket(callback) {
      this.ws = new WebSocket(this.uploadUrl)
      /* 链接成功 */
      this.ws.onopen = () => {
        callback && callback()
      }
      this.ws.onmessage = e => {
        const data = e.data
        this.reset()
        this.start()
        if (isNaN(data) === false) {
          this.isShowProgress = true
          this.cuLoaded = parseInt(data)
          this.showProcess()
          this.bindReader()
        } else if (data === 'canceled') {
          this.cuLoaded = 0
          this.percent = 0
          this.showProcess()
          this.enableRead = false
          this.reader.abort()
          this.isShowContinueBtn = this.isShowSuspendBtn = this.isShowCancelBtn = false
          this.reset()
        } else if (data === 'ok') {
          if (this.cuLoaded < this.total) {
            this.readBlob()
          } else {
            this.ws.send('act:complete')
          }
          this.showProcess()
        } else if (data !== 'ping') {
          /* 上传成功后的文件路径 */
          this.$emit('onSuccess', data, this.currentMd5, this.file.size)
          this.reset()
        }
      }
      this.ws.onclose = e => {
        console.log(e)
        this.reconnect()
      }
      this.ws.onerror = e => {
        this.reconnect()
        console.error(e)
        this.$Message.error('传输中发生异常')
      }
    },
    // 显示结果进度
    showProcess() {
      const percent = ((this.cuLoaded / this.total) * 100)
      this.percent = parseInt(percent.toFixed(0))
      this.$emit('getPercent', percent.toFixed(2) + '%')
    },
    // 绑定reader
    bindReader() {
      this.startTime = new Date()
      this.enableRead = true
      this.reader = new FileReader()
      // 读取一段成功
      this.reader.onload = (e) => {
        if (this.enableRead === false) {
          return false
        }
        // 根据当前缓冲区来控制客户端读取速度
        if (this.ws.bufferedAmount > this.step * 10) {
          setTimeout(() => {
            // 继续读取
            this.loadSuccess(e.loaded)
          }, 3)
        } else {
          // 继续读取
          this.loadSuccess(e.loaded)
        }
      }
      // 开始读取
      this.readBlob()
    },
    onchange(e) {
      this.fileTarget = e.target
      const getFileType = (value) => {
        value = value.split('.')
        return value[value.length - 1]
      }
      const fileType = getFileType((this.fileTarget.value))
      if (!this.fileType || (this.fileType && this.fileType.includes(fileType))) {
        // 获取文件对象
        const file = (event.target.files || event.dataTransfer.files)[0]
        /* 判断文件大小是否超出限制 */
        if (file && file.size > this.maxSize) {
          return this.$emit('overSize')
        }
        this.file = file
        if (this.file) {
          this.total = this.file.size
        }
        const startSend = () => {
          if (this.ws == null) {
            this.$Modal.confirm({
              title: '温馨提示',
              content: '与服务器链接失败,确定重试链接吗',
              onOk: () => {
                this.createWebSocket(this.sendFileName)
              }
            })
            return
          }
          this.percent = 0
          this.sendFileName()
        }
        if (this.needMd5) {
          md5File(file, (md5) => {
            this.currentMd5 = md5
            if (this.md5 === md5) {
              this.percent = 100
              this.$emit('getPercent', '100%')
            } else {
              startSend()
            }
          })
        } else {
          startSend()
        }
      } else {
        this.$Message.error('请上传正确的文件类型')
      }
    },
    // 指定开始位置，分块读取文件
    readBlob() {
      // 指定开始位置和结束位置读取文件
      if (this.file) {
        const blob = this.file.slice(this.cuLoaded, this.cuLoaded + this.step)
        this.reader.readAsArrayBuffer(blob)
      }
    },
    sendFileName() {
      this.$emit('getFileName', this.file.name)
      this.ws.send('fileName:' + this.file.name)
    },
    // 读取文件成功处理
    loadSuccess(loaded) {
      // 将分段数据上传到服务器
      const blob = this.reader.result
      // 使用WebSocket 服务器发送数据
      this.ws.send(blob)
      // 如果没有读完，继续
      this.cuLoaded += loaded
    },
    /**
       * 暂停
       */
    suspend() {
      // 中止读取操作
      this.isShowSuspendBtn = false
      this.isShowContinueBtn = true
      this.enableRead = false
      this.reader && this.reader.abort()
    },
    // 继续
    goOn() {
      this.isShowSuspendBtn = true
      this.isShowContinueBtn = false
      this.enableRead = true
      this.readBlob()
    },
    /**
       * 取消
       */
    cancel() {
      this.fileTarget.value = null
      this.file = null
      this.isShowProgress = false
      this.$emit('cancelUpload')
      if (this.ws) {
        this.ws.send('act:cancel')
      }
    },
    /**
       * 重连
       */
    reconnect() {
      if (this.lockReconnect) return
      this.lockReconnect = true
      setTimeout(() => { // 没连接上会一直重连，设置延迟避免请求过多
        this.createWebSocket((this.percent < 100 && this.percent > 0) && this.sendFileName)
        this.lockReconnect = false
      }, 2000)
    },
    reset() {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    start() {
      this.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        this.ws.send('act:ping')
        this.serverTimeoutObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
          this.ws.close() // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, this.timeout)
      }, this.timeout)
    }
  },
}
</script>
<style scoped>
  @import "../lib/css/index.css";
</style>
