import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    patch(vnode, container);
}

function patch(vnode, container) {
    const { shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
}

function processComponent(vnode, container) {
    mountComponent(vnode, container);
}

function processElement(vnode, container) {
    mountElement(vnode, container);
}

function mountComponent(initinalVNode, container) {
    const instance = createComponentInstance(initinalVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initinalVNode, container)
}

function mountElement(vnode, container) {
    const { type,children,props,shapeFlag } = vnode

    const el = vnode.el = document.createElement(type)

    if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }else if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        el.textContent = children
    }

    for (const key in props) {
        const value = props[key]
        el.setAttribute(key, value)
    }

    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(child => {
        patch(child, container)
    });
}

function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container)
    initialVnode.el = subTree.el
}