import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        window.self = this
        return h(
            "div", 
            {
                id: "root",
                onClick() {
                    console.log("click")
                }
            }, 
            // "hi, " + this.msg
            [
                h("div", {}, "hi, "+this.msg),
                h(Foo, { count: 1 })
            ]
        )
    },
    setup() {
        return {
            msg: "mini-vue-haha"
        }
    }
}