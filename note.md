Vnode
const vnode = {
  type: 'div',               // 标签类型（如 'div'、组件、Fragment等）
  props: { id: 'app' },      // 标签属性
  children: [                // 子节点（可以是字符串、VNode数组等）
    { type: 'span', props: null, children: 'Hello' }
  ],
  el: null                   // 与真实 DOM 的映射关系（初始为 null）
}


根据vnode创建组件实例:Instance
🔧 组件实例是一个“活着的对象”，它包含：
属性 / 功能	             说明
setup()                 返回的内容	放入实例并暴露给模板
响应式状态	             ref, reactive, props, data 等
生命周期钩子	         onMounted, onUpdated 等
渲染函数	            用于生成 VNode 的 render()
DOM 引用	            el 指向真实 DOM，或 $el
插槽 / 子组件	         管理子内容和插槽的调用
上下文 API	            比如 attrs, slots, emit, expose, provide/inject 等



组件Component
就是App.js


h函数返回虚拟节点vnode