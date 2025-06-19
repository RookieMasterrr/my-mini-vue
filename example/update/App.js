import { h, ref } from "../../lib/guide-mini-vue.esm.js"
import { ArrayToText } from "./ArrayToText.js"

export const App = {
    name: "App",

    render() {
        return h('div', {tId: 1}, [
            h("p", {}, "主页"),
            h(ArrayToText),
        ])
    },

    setup() {
        return {}
    },
}