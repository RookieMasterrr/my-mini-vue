import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment,Text } from "./vnode";

export function render(vnode, container, parentComponent) {
    patch(vnode, container, parentComponent);
}

function patch(vnode, container, parentComponent) {
    const { type, shapeFlag } = vnode

    switch (type) {
        case Fragment:
            processFragment(vnode, container, parentComponent)
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container, parentComponent);
            }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }

}

function processText(vnode, container) {
    const {children:text} = vnode
    const textNode = vnode.el = document.createTextNode(text)
    container.append(textNode)
}

function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent)
}

function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}

function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
}

function mountComponent(initinalVNode, container, parentComponent) {
    const instance = createComponentInstance(initinalVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initinalVNode, container)
}

function mountElement(vnode, container, parentComponent) {
    const { type,children,props,shapeFlag } = vnode

    const el = vnode.el = document.createElement(type)

    if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el, parentComponent)
    }else if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        el.textContent = children
    }

    for (const key in props) {
        const value = props[key]
        const isOn = (key:string)=>/^on[A-Z]/.test(key)
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, value)
        }else {
            el.setAttribute(key, value)
        }
    }

    container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(child => {
        patch(child, container, parentComponent)
    });
}

function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container, instance)
    initialVnode.el = subTree.el
}


