import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    setup() {
        return {}
    },
    render() {
        const foo = h("p", {}, "foo")
        const age = 'message';
        return h('div', {}, 
            [
                renderSlots(this.$slots, 'header', {
                    age
                }), 
                renderSlots(this.$slots, 'main'),
                foo,
                renderSlots(this.$slots, 'footer')
            ]) // 插槽的使用方式, 子节点
    }
}