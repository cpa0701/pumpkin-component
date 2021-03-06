/**
 * Create by Pengan Chen on 2020/3/17
 */
// 导入组件，组件必须声明 name
import PkIconSvg from './src/pk-icon-svg.vue'

// 为组件提供 install 安装方法，供按需引入
PkIconSvg.install = function(Vue) {
  Vue.component(PkIconSvg.name, PkIconSvg)
}

// 默认导出组件
export default PkIconSvg
