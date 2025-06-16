import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance, children) {

    if (instance.vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN) { // 判断是否是一个插槽
        const slots = {}
        for (const key in children) {
            const value = children[key]
            slots[key] = (props)=>normalizeSlotValue(value(props))
        }
    
        instance.slots = slots
    }

}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}