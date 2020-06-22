/**
 * Create by Pengan Chen on 2020/6/19
 */
// 导入组件，组件必须声明 name
import PkEllipsis from './src/pk-ellipsis.vue'

// 为组件提供 install 安装方法，供按需引入
PkEllipsis.install = function(Vue) {
  Vue.component(PkEllipsis.name, PkEllipsis)
}

// 默认导出组件
export default PkEllipsis
