import { createVNode, Fragment } from "../runtime-core/vnode";

export function renderSlots(slots, name, props) {
    const slot = slots[name]
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props))
        }
    }
}