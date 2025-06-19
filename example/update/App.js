import { h, ref } from "../../lib/guide-mini-vue.esm.js"
import { TextToText } from "./TextToText.js"

export const App = {
    name: "App",

    render() {
        return h('div', {tId: 1}, [
            h("p", {}, "主页"),
            // h(ArrayToText),
            h(TextToText),
        ])
    },

    setup() {
        return {}
    },
}