import { h, ref } from "../../lib/guide-mini-vue.esm.js"

const prevChildren = "oldChild"
const nextChildren = "newChild"

export const TextToText = {
    name: 'TextToText',
    setup() {
        const isChange = ref(false);
        window.isChange = isChange

        return {
            isChange
        }
    },
    render() {
        const self = this
        return self.isChange === true
            ? h("div", {}, nextChildren)
            : h("div", {}, prevChildren)
    }
}