/**
 * Create by Pengan Chen on 2020/6/19
 */
// 导入组件，组件必须声明 name
import PkUpload from './src/pk-upload.vue'

// 为组件提供 install 安装方法，供按需引入
PkUpload.install = function(Vue) {
  Vue.component(PkUpload.name, PkUpload)
}

// 默认导出组件
export default PkUpload
