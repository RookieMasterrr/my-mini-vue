import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        return h("div", {}, [h("div", {}, "App"), h(Foo, {
            onAdd(a, b) {
                console.log(a, b)
                console.log('event: add trigger')
            },
            onAddFoo() {
                console.log('onAddFoo')
            }
        })])
    },
    setup() {
        return {}
    }
}