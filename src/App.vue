<template>
  <div id="app">
    <pk-markdown :upload-url="'/user-api/uploadFile/image'" :value="value" @input-value="change" />
    <hr>
    <p>页面效果如下</p>
    <pk-markdown id="viewer" :value="value" viewer />
    <!--    图片文字分割-->
    <!--    <pk-markdown id="viewer" :value="value" viewer divide-img />-->
    <!--    <div class="img-list"></div>-->
    <pk-footer />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      value: ''
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
