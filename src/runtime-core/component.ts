import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parentComponent) {
    console.log(parentComponent);
    
    const instance:any = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: {},
        props: {},
        slots: {},
        provides: parentComponent ? parentComponent.provides : {},
        parent: parentComponent,
        emit: null
    }
    instance.emit = emit.bind(null, instance)
    return instance
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type
    instance.proxy = new Proxy({instance}, PublicInstanceProxyHandles)
    const { setup } = Component

    if(setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        setCurrentInstance(null)
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

let currentInstance = null;

export function getCurrentInstance() {
    if (currentInstance) {
        return currentInstance
    }
}

function setCurrentInstance(instance) {
    currentInstance = instance
}