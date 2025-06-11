import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        const app = h('div', {}, 'App')

        const slots = {
            header: ({age}) => h("p", {}, "123"+age),
            main: () => h("p", {}, "456"),
            footer: () => h("p", {}, "789"),
        }

        // const slots = h("p", {}, "123")
        const foo = h(Foo, {}, slots) // 插槽的使用方式, 父节点

        return h("div", {}, [app, foo])
    },
    setup() {
        return {}
    }
}