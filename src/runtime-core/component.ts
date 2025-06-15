import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
    const instance:any = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: {},
        props: {},
        emit: null
    }
    instance.emit = emit.bind(null, instance)
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
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
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

