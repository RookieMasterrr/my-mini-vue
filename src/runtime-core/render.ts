import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {
    debugger
    // 判断vnode是不是element, 判断是component还是vnode(element)

    if(typeof vnode.type === 'string') {
        processElement(vnode, container)
    }else if(isObject(vnode.type)) {
        processComponent(vnode, container)
    }

}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountElement(vnode: any, container: any) {
    const el = document.createElement(vnode.type)

    const { children } = vnode

    el.textContent = children

    const { props } = vnode
    for (const key in props) {
        const value = props[key]            
        el.setAttribute(key, value)
    }

    container.append(el)
}

function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode)

    setupComponent(instance)
    setupRenderEffect(instance, container)
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render()

    patch(subTree, container)
}



