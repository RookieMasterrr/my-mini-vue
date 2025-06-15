import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: {},
        props: {}
    }
    return instance
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    // initSlots
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type

    instance.proxy = new Proxy({instance}, PublicInstanceProxyHandles)

    const { setup } = Component

    if(setup) {
        const setupResult = setup( shallowReadonly(instance.props))
        handleSetupResult(instance, setupResult)
    }

}
function handleSetupResult(instance, setupResult) {
    // function / Object
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type
    if(Component.render) {
        instance.render = Component.render
    }
}

