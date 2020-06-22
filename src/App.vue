<template>
  <div id="app">
    <pk-markdown :upload-url="'/user-api/uploadFile/image'" :value="value" @input-value="change" />
    <hr>
    <p>页面效果如下</p>
    <pk-markdown id="viewer" :value="value" viewer />
    <!--    图片文字分割-->
    <!--    <pk-markdown id="viewer" :value="value" viewer divide-img />-->
    <!--    <div class="img-list"></div>-->
    <hr>
    <p>多行文本省略组件</p>
    <pk-ellipsis style="width: 100px" :content="content" :lines="2"></pk-ellipsis>
    <hr>
    <p>断点续传组件</p>
    <pk-upload upload-url="ws://42.48.104.46:15012/file-api/fileUpload/ws" />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      value: '',
      content: '来打开辣酸奶付款了男篮烦了呢蓝风铃拿了卡瓦尼分类卡尔维诺福利卡你到时sdafeajkljfkljsljklanfr放假快乐加快了放假快乐染发禄口街道绿山咖啡就罗昆接啊我看了分卡拉尔基弗兰克斯的经历了开发 就理解上大立科技卡萨丁'
    }
  },
  methods: {
    change(value) {
      this.value = value
    }
  }
}
</script>
<style>
  #viewer {
    overflow: auto;
    height: calc(100vh - 8px - 300px - (21px + 32px) - 20px);
    border: 1px solid #ddd;
  }
</style>
