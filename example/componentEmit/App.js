import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    render() {
        return h(
            'div', 
            {
                id:'root', class: ['red', 'hard'], 
            },
            [
                h('div', {}, 'hi,'+this.msg), 
                h(Foo, {
                    onAdd(a, b) {
                        console.log('onAdd')
                        console.log(`a = ${a}`)
                        console.log(`b = ${b}`)
                    },
                    onAddFoo() {
                        console.log('onAddFoo')
                    }
                })
                // 这里的Foo就是子组件
            ]
        )
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}