import { h, ref } from "../../lib/guide-mini-vue.esm.js"

// 1. 左侧的对比
// (a b) c
// (a b) d e
// const prevChildren = [
//     h("div", { key: "A" }, "A"), 
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ]
// const nextChildren = [
//     h("div", { key: "A" }, "A"), 
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "E" }, "E"),
// ]


// 2. 右端的对比
// a (b c)
// d e (b c)
// const prevChildren = [
//     h("div", { key: "A" }, "A"), 
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ]
// const nextChildren = [
//     h("div", { key: "D" }, "D"),
//     h("div", { key: "E" }, "E"),
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ]


// 3. 新的比老的长, 左侧
// (a b) 
// (a b) c
// const prevChildren = [
//     h("div", { key: "A" }, "A"), 
//     h("div", { key: "B" }, "B"),
// ]
// const nextChildren = [
//     h("div", { key: "A" }, "A"), 
//     h("div", { key: "B" }, "B"),
//     h("div", { key: "C" }, "C"),
// ]

// 4. 新的比老的长, 右侧
// (a b) 
// c (a b)
const prevChildren = [
    h("div", { key: "A" }, "A"), 
    h("div", { key: "B" }, "B"),
]
const nextChildren = [
    h("div", { key: "C" }, "C"),
    h("div", { key: "A" }, "A"), 
    h("div", { key: "B" }, "B"),
]


// 老的比新的长
export const ArrayToArray = {
    name: 'ArrayToArray',
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