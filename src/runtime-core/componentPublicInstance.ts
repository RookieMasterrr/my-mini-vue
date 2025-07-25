import { hasOwn } from "../shared"

const publicPropertiesMap = {
    $el: (instance)=>instance.vnode.el,
    $slots: (instance)=>instance.slots
}

export const PublicInstanceProxyHandles = {
    get({instance}, key) {
        const { setupState, props } = instance
        if (key in setupState)    {
            return setupState[key]
        }

        if (hasOwn(setupState, key)){
            return setupState[key]
        }else if (hasOwn(props, key)) {
            return props[key]
        }

        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    },
}