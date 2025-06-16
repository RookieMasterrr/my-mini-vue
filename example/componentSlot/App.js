import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    name: "App",
    render() {
        const app = h("div", {}, "App")
        const foo = h(Foo, {}, {
            header: (props)=>h("p", {}, "header" + props.age), 
            footer: ()=>h("p", {}, "footer")
        })

        return h("div", {}, [app, foo])
    },
    setup() {
        return {}
    }
}