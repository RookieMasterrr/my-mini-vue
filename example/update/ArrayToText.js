import { h, ref } from "../../lib/guide-mini-vue.esm.js"

const nextChildren = "newChildren"
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")]

export const ArrayToText = {
    name: 'ArrayToText',
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