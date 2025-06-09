import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    render() {
        window.self = this
        return h(
            'div', 
            {
                id:'root', class: ['red', 'hard'], 
                onClick() {
                    console.log('click')
                },
                onMousedown() {
                    console.log('mousedown')
                }
            },
            [
                h('div', {}, 'hi,'+this.msg), 
                h(Foo, {
                    count:1
                })
                // 这里的Foo就是子组件
            ]
            // [h("p", { class: "red" }, 'hi'), h("p", { class: "blue" }, this.msg)]
        )
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}