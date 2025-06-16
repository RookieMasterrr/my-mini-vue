import { createVNode } from "./vnode";

// h函数第三个参数, 只能是字符串或者h数组
export function h(type, props?, children?) {
    return createVNode(type, props, children)
}