import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment } from "./vnode"

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {
    // 判断vnode是元素的vnode, 还是组件vnode
    // 最重要的就是要区分出processElement和processComponent
    const { type, shapeFlag } = vnode

    switch (type) {
        case Fragment:
            processFragment(vnode, container)
            break;
    
        default:
            if(shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container)
            }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container)
            }
            break;
    }
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function processFragment(vnode, container) {
    mountChildren(vnode, container)
}

function mountElement(vnode: any, container: any) {
    const el = vnode.el = document.createElement(vnode.type)

    const { children } = vnode
    const { shapeFlag } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    
    const { props } = vnode
    for (const key in props) {
        const value = props[key]
        const isOn = (key:string) => /^on[A-Z]/.test(key)
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase()
            el.addEventListener(event, value)
        }else {
            el.setAttribute(key, value)
        }
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach((v)=>{
        patch(v, container)
    })
}


function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container)
    initialVnode.el = subTree.el
}