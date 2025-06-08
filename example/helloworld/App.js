import { h } from "../../lib/guide-mini-vue.esm.js"

export const App = {
    render() {
        return h('div', 
            {
                id:'root', class: ['red', 'hard']
            },
            'hi, mini-vue'
        )
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}